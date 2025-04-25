import { ethers } from 'ethers';
import prisma from '@/lib/prisma';
import ABI from "../../../../../../contracts/certificate.json";
import { NextResponse } from 'next/server';

export async function GET(req: Request) {

	const certificateId = req.url.split('/').pop();

	if (!certificateId) {
		return NextResponse.json({ error: 'Method not allowed' }, {status: 405});
	}

	const certificateDatafromDB = await prisma.certificate.findUnique({
		where: {
			id: certificateId
		},
		include: {
			recipient: true,
			issuer: true
		}
	})

	const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
	const wallet = new ethers.Wallet(process.env.ETHEREUM_PRIVATE_KEY!, provider);
	const contract = new ethers.Contract(
		process.env.CERTIFICATE_CONTRACT_ADDRESS!,
		ABI,
		wallet
	);

	try {
    // Get full certificate data
    const certData = await contract.getCertificate(certificateId);
    console.log('Certificate Data:', certData);
    
		// Convert BigInt values to strings
    const serializableCertData = Object.fromEntries(
      Object.entries(certData).map(([key, value]) => [
        key, 
        typeof value === 'bigint' ? value.toString() : value
      ])
    );

		const certificateHash = ethers.keccak256(
      ethers.toUtf8Bytes(`${certificateDatafromDB?.certificateTheme}${certificateDatafromDB?.certificateBody}`)
    );
		let issuerHash
		if (certificateDatafromDB?.issuerType === "PERSON") {
			issuerHash = ethers.keccak256(
        ethers.toUtf8Bytes(
          `${certificateDatafromDB.issuerIIN}${certificateDatafromDB.issuer.name}${certificateDatafromDB.issuer.surname}`
        )
      );
		} else {
			issuerHash = ethers.keccak256(
				ethers.toUtf8Bytes(
					`${certificateDatafromDB?.issuerIIN}${certificateDatafromDB?.issuer.name}${certificateDatafromDB?.issuer.surname}${certificateDatafromDB?.BIN}${certificateDatafromDB?.organisationName}`
				)
			);
		}

		return NextResponse.json({
			certificateDatafromDB,
			serializableCertData,
			certificateHash,
			issuerHash,
			check: {
				isIssuerHashTrue: issuerHash === serializableCertData['4'],
				isCertificateHashTrue: certificateHash === serializableCertData['5']
			}
		})
  } catch (error) {
    console.error('Error:', error);
		return NextResponse.json({
			error
		}, {status: 500})
  }

}