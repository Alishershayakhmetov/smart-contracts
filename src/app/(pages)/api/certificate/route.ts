import { ethers } from 'ethers';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { contract } from '@/lib/ethereum';

export async function POST(
  req: Request,
) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, {status: 405});
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
      dateOfIssue
    } = await req.json();

    const {recipient, issuer} = await getUsers(recipientIIN, issuerIIN);
    if (!recipient || !issuer) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const {certificateHash, issuerHash} = generateHashes({issuerType, certificateTheme, certificateBody, issuerIIN, issuer, BIN, organisationName});

    const dbData = generateDBData({recipientIIN,
      issuerType,
      issuerIIN,
      organisationName,
      BIN,
      certificateTheme,
      certificateBody,
      dateOfIssue});

    // Store in db
    const certificate = await prisma.certificate.create({
      data: dbData,
    });

    const tx = await contract.issueCertificate(
      certificate.id,
      recipientIIN,
      issuerIIN,
      (issuerType.toUpperCase() === "PERSON" ? 0 : 1),
      issuerHash,
      certificateHash,
      Math.floor(Date.now() / 1000)
    );

    await tx.wait();

    return NextResponse.json({
      success: true,
      certificateId: certificate.id,
      tx
    }, {status: 201});
  } catch (error) {
    console.error('Error issuing certificate:', error);
    return NextResponse.json({ error }, {status: 500});
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

enum IssuerType {
  PERSON = "PERSON",
  ORGANIZATION = "ORGANIZATION"
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

  const prismaIssuerType = issuerType.toUpperCase() === 'PERSON' ? IssuerType.PERSON : IssuerType.ORGANIZATION;

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