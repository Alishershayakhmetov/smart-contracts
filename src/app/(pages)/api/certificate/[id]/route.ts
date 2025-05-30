import { ethers } from 'ethers';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { contract } from '@/lib/ethereum';
import { CertificateDBData, CertificateResponse } from '@/interfaces/interface';

const extractCertificateId = (url: string): string | null => {
  const parts = url.split('/');
  return parts.pop() || null;
};

const fetchCertificateFromDB = async (certificateId: string) => {
  return await prisma.certificate.findUnique({
    where: { id: certificateId },
    include: {
      recipient: {
        select: {
          name: true,
          surname: true,
					iin: true
        }
      },
      issuer: {
        select: {
          name: true,
          surname: true,
					iin: true
        }
      }
    }
  });
};

const fetchCertificateFromBlockchain = async (certificateId: string) => {
  const certData = await contract.getCertificate(certificateId);
  return Object.fromEntries(
    Object.entries(certData).map(([key, value]) => [
      key, 
      typeof value === 'bigint' ? value.toString() : value
    ]
  ));
};

const generateCertificateHash = (theme: string, body: string): string => {
  return ethers.keccak256(ethers.toUtf8Bytes(`${theme}${body}`));
};

const generateIssuerHash = (dbData: CertificateDBData): string => {
  const { issuerType, issuerIIN, issuer, BIN, organisationName } = dbData;
  
  if (issuerType === 'PERSON') {
    return ethers.keccak256(
      ethers.toUtf8Bytes(`${issuerIIN}${issuer.name}${issuer.surname}`)
    );
  }
  
  return ethers.keccak256(
    ethers.toUtf8Bytes(
      `${issuerIIN}${issuer.name}${issuer.surname}${BIN}${organisationName}`
    )
  );
};

const verifyCertificate = (
  dbData: CertificateDBData,
  blockchainData: Record<string, any>
): CertificateResponse => {
  const certificateHash = generateCertificateHash(
    dbData.certificateTheme, 
    dbData.certificateBody
  );
  
  const issuerHash = generateIssuerHash(dbData);

  if(issuerHash !== blockchainData['4'] || certificateHash !== blockchainData['5']) {
    return {
      error: "hashes are not matching",
      verification: {
        certificateHash,
        issuerHash,
        smartContractIssuerHash: blockchainData['4'],
        smartContractCertificateHash: blockchainData['5'],
      }
    }
  }

  return {
    certificateDataFromDB: dbData,
    verification: {
      certificateHash,
      issuerHash,
      smartContractIssuerHash: blockchainData['4'],
      smartContractCertificateHash: blockchainData['5'],
    }
  };
};

// Main endpoint handler
export async function GET(req: Request) {
  try {
    const certificateId = extractCertificateId(req.url);
    
    if (!certificateId) {
      return NextResponse.json(
        { error: 'Certificate ID is required' },
        { status: 400 }
      );
    }

    const dbData = await fetchCertificateFromDB(certificateId);
    
    if (!dbData) {
      return NextResponse.json(
        { error: 'Certificate not found in database' },
        { status: 404 }
      );
    }

    const blockchainData = await fetchCertificateFromBlockchain(certificateId);
    const response = verifyCertificate(dbData, blockchainData);

    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Certificate verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify certificate' },
      { status: 500 }
    );
  }
}