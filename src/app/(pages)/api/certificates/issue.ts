import { ethers } from 'ethers';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import ABI from "../../../../../contracts/certificate.json";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
  /*
  recipientIIN;
  recipientNameAndSurname
  issuerType
  issuerIIN
  issuerNameAndSurname
  organisationName
  BIN
  certificateTheme
  certificateBody
  dateOfIssue
  */
  /*
  iinRecipient,
      certificateTheme,
      certificateBody,
      issuerType,
      issuerData
  */
    const {
      recipientIIN,
      issuerType,
      issuerIIN,
      organisationName,
      BIN,
      certificateTheme,
      certificateBody,
      dateOfIssue
    } = req.body;

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

    // 1. Generate hashes
    const certificateHash = ethers.keccak256(
      ethers.toUtf8Bytes(`${certificateTheme}${certificateBody}`)
    );

    let issuerHash: string;
    let dbData;
    if (issuerType === 'PERSON') {
      issuerHash = ethers.keccak256(
        ethers.toUtf8Bytes(
          `${issuerIIN}${issuer?.name}${issuer?.surname}`
        )
      );
      dbData = {
        recipientIIN,
        issuerType,
        issuerIIN,
        certificateTheme,
        certificateBody,
        dateOfIssue
      }
    } else {
      issuerHash = ethers.keccak256(
        ethers.toUtf8Bytes(
          `${issuerIIN}${issuer?.name}${issuer?.surname}${BIN}${organisationName}`
        )
      );
      dbData = {
        recipientIIN,
        issuerType,
        issuerIIN,
        organisationName,
        BIN,
        certificateTheme,
        certificateBody,
        dateOfIssue
      }
    }

    // 2. Store in database
    const certificate = await prisma.certificate.create({
      data: dbData,
    });

    // 3. Deploy to blockchain
    const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
    const wallet = new ethers.Wallet(process.env.ETHEREUM_PRIVATE_KEY!, provider);
    const contract = new ethers.Contract(
      process.env.CERTIFICATE_CONTRACT_ADDRESS!,
      ABI,
      wallet
    );

    const tx = await contract.issueCertificate(
      certificate.id,
      recipientIIN,
      issuerIIN,
      issuerType,
      issuerHash,
      certificateHash,
      Math.floor(Date.now() / 1000)
    );

    await tx.wait();

    // 5. Generate certificate URL
    const certificateUrl = `${req.headers.origin}/certificates/${certificate.id}`;

    res.status(201).json({
      success: true,
      certificateId: certificate.id,
      txHash: tx.hash,
      certificateUrl,
    });
  } catch (error) {
    console.error('Error issuing certificate:', error);
    res.status(500).json({ error });
  }
}