import { ethers } from 'ethers';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { contract } from '@/lib/ethereum';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { IssuerType } from '@/generated/prisma';

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const {
      recipientIIN,
      issuerType,
      issuerIIN,
      organisationName,
      BIN,
      certificateTheme,
      certificateBody,
    } = await req.json();

    // Validate users first
    const { recipient, issuer } = await getUsers(recipientIIN, issuerIIN);
    if (!recipient || !issuer) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate hashes
    const { certificateHash, issuerHash } = generateHashes({
      issuerType, 
      certificateTheme, 
      certificateBody, 
      issuerIIN, 
      issuer, 
      BIN, 
      organisationName
    });

    // Prepare DB data
    const dbData = generateDBData({
      recipientIIN,
      issuerType,
      issuerIIN,
      organisationName,
      BIN,
      certificateTheme,
      certificateBody,
      dateOfIssue: (new Date()).toString()
    });

    // Transaction wrapper
    const result = await createRecordsInDBAndSmartContract({
      dbData,
      recipientIIN,
      issuerIIN,
      issuerType,
      issuerHash,
      certificateHash
    });

    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error('Error issuing certificate:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Operation failed' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's IIN from the database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { iin: true }
    });

    if (!user?.iin) {
      return NextResponse.json({ error: 'User IIN not found' }, { status: 404 });
    }

    // Find all certificates where the user is either issuer or recipient
    const certificates = await prisma.certificate.findMany({
      where: {
        OR: [
          { issuerIIN: user.iin },
          { recipientIIN: user.iin }
        ]
      },
      orderBy: {
        dateOfIssue: 'desc'
      }
    });

    return NextResponse.json(certificates);
    
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch certificates' },
      { status: 500 }
    );
  }
}

const getUsers = async (recipientIIN: string, issuerIIN: string) => {
  const recipient = await prisma.user.findUnique({
    where: {
      iin: recipientIIN
    },
    select: {
      name: true,
      surname: true
    }
  })

  const issuer = await prisma.user.findUnique({
    where: {
      iin: issuerIIN
    },
    select: {
      name: true,
      surname: true
    }
  })

  return {recipient, issuer};
}

const generateHashes = ({issuerType, certificateTheme, certificateBody, issuerIIN, issuer, BIN, organisationName} : {issuerType: string, certificateTheme: string, certificateBody: string, issuerIIN: string, issuer: {name: string, surname: string}, BIN: string, organisationName: string}) => {
  // Generate hashes
  const certificateHash = ethers.keccak256(
    ethers.toUtf8Bytes(`${certificateTheme}${certificateBody}`)
  );

  let issuerHash: string;
  if (issuerType.toUpperCase() === 'PERSON') {
    issuerHash = ethers.keccak256(
      ethers.toUtf8Bytes(
        `${issuerIIN}${issuer?.name}${issuer?.surname}`
      )
    )
  } else {
    issuerHash = ethers.keccak256(
      ethers.toUtf8Bytes(
        `${issuerIIN}${issuer?.name}${issuer?.surname}${BIN}${organisationName}`
      )
    )
  }
  
  return {certificateHash, issuerHash}
}

const generateDBData = ({recipientIIN,issuerType,issuerIIN,organisationName,BIN,certificateTheme,certificateBody,dateOfIssue} : {recipientIIN: string,issuerType: string,issuerIIN: string,organisationName: string,BIN: string,certificateTheme: string,certificateBody: string,dateOfIssue: string}) : {
  recipientIIN: string;
  issuerType: IssuerType;
  issuerIIN: string;
  organisationName: string | null;
  BIN: string | null;
  certificateTheme: string;
  certificateBody: string;
  dateOfIssue: Date;
} => {

  const prismaIssuerType = issuerType.toUpperCase() === 'PERSON' ? IssuerType.PERSON : IssuerType.ORGANISATION;

  if (prismaIssuerType === IssuerType.PERSON) {
    return {
      recipientIIN,
      issuerType: prismaIssuerType,
      issuerIIN,
      certificateTheme,
      certificateBody,
      dateOfIssue: new Date(dateOfIssue),
      organisationName: null,
      BIN: null,
    }
  } else {
    return {
      recipientIIN,
      issuerType: prismaIssuerType,
      issuerIIN,
      organisationName,
      BIN,
      certificateTheme,
      certificateBody,
      dateOfIssue: new Date(dateOfIssue)
    }
  }
}

// Atomic operation handler
async function createRecordsInDBAndSmartContract(params: {
  dbData: any;
  recipientIIN: string;
  issuerIIN: string;
  issuerType: string;
  issuerHash: string;
  certificateHash: string;
}) {
  let certificate: any;

  try {
    // 1. First create in database
    certificate = await prisma.certificate.create({
      data: params.dbData,
    });

    // 2. Then execute blockchain operation
    const tx = await contract.issueCertificate(
      certificate.id,
      params.recipientIIN,
      params.issuerIIN,
      (params.issuerType.toUpperCase() === "PERSON" ? 0 : 1),
      params.issuerHash,
      params.certificateHash,
      Math.floor(Date.now() / 1000)
    );

    await tx.wait();

    return {
      success: true,
      certificateId: certificate.id,
      txHash: tx.hash
    };

  } catch (error) {
    console.error('Atomic operation failed:', error);
    
    // Rollback database if certificate was created but blockchain failed
    if (certificate?.id) {
      await prisma.certificate.delete({
        where: { id: certificate.id }
      }).catch(console.error);
    }

    throw error; // Re-throw for outer catch block
  }
}