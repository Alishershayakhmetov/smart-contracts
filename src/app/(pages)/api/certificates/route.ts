import { ethers } from 'ethers';
import prisma from '@/lib/prisma';
import ABI from "../../../../../contracts/certificate.json";
import { NextResponse } from 'next/server';

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

    console.log(recipientIIN,
      issuerType,
      issuerIIN,
      organisationName,
      BIN,
      certificateTheme,
      certificateBody,
      dateOfIssue);

    console.log(req.body);

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
    if (issuerType.toUpperCase() === 'PERSON') {
      issuerHash = ethers.keccak256(
        ethers.toUtf8Bytes(
          `${issuerIIN}${issuer?.name}${issuer?.surname}`
        )
      );
      dbData = {
        recipientIIN,
        issuerType: issuerType.toUpperCase(),
        issuerIIN,
        certificateTheme,
        certificateBody,
        dateOfIssue: new Date(dateOfIssue)
      }
    } else {
      issuerHash = ethers.keccak256(
        ethers.toUtf8Bytes(
          `${issuerIIN}${issuer?.name}${issuer?.surname}${BIN}${organisationName}`
        )
      );
      dbData = {
        recipientIIN,
        issuerType: issuerType.toUpperCase(),
        issuerIIN,
        organisationName,
        BIN,
        certificateTheme,
        certificateBody,
        dateOfIssue: new Date(dateOfIssue)
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

    console.log(process.env.ETHEREUM_RPC_URL, process.env.ETHEREUM_PRIVATE_KEY, process.env.CERTIFICATE_CONTRACT_ADDRESS)

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

    // 5. Generate certificate URL
    // const certificateUrl = `${req.headers.get(origin)}/certificates/${certificate.id}`;

    const certificateUrl = `http://localhost:300/api/certificates/${certificate.id}`;

    return NextResponse.json({
      success: true,
      certificateId: certificate.id,
      txHash: tx.hash,
      certificateUrl,
    }, {status: 201});
  } catch (error) {
    console.error('Error issuing certificate:', error);
    return NextResponse.json({ error }, {status: 500});
  }
}