import { PrismaClient } from "@prisma/client";
import { ethers } from "ethers";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

interface CertificatePageProps {
  certificate: {
    id: string;
    iinRecipient: string;
    issuerType: "PERSON" | "ORGANIZATION";
    dateOfIssue: string;
    txHash: string | null;
  };
  blockchainData: any | null;
}

export default function CertificatePage({
  certificate,
  blockchainData,
}: CertificatePageProps) {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Certificate #{id}</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold">Recipient IIN</h2>
            <p>{certificate.iinRecipient}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Issuer Type</h2>
            <p>{certificate.issuerType}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Date of Issue</h2>
            <p>{new Date(certificate.dateOfIssue).toLocaleDateString()}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Transaction Hash</h2>
            <p className="truncate">
              {certificate.txHash ? (
                <a
                  href={`https://${process.env.NEXT_PUBLIC_ETHEREUM_NETWORK}.etherscan.io/tx/${certificate.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {certificate.txHash}
                </a>
              ) : (
                "Pending..."
              )}
            </p>
          </div>
        </div>

        {blockchainData && (
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <h2 className="text-lg font-semibold mb-2">
              Blockchain Verification
            </h2>
            <pre className="text-xs overflow-x-auto p-2 bg-white rounded">
              {JSON.stringify(blockchainData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  const prisma = new PrismaClient();

  try {
    const certificate = await prisma.certificate.findUnique({
      where: { id: id as string },
    });

    if (!certificate) {
      return { notFound: true };
    }

    let blockchainData = null;
    if (certificate.txHash) {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.ETHEREUM_RPC_URL
      );
      const contract = new ethers.Contract(
        process.env.CERTIFICATE_CONTRACT_ADDRESS!,
        require("../../contracts/Certificate.json").abi,
        provider
      );

      blockchainData = await contract.certificates(certificate.id);
    }

    return {
      props: {
        certificate: {
          ...certificate,
          dateOfIssue: certificate.dateOfIssue.toISOString(),
        },
        blockchainData: blockchainData
          ? {
              iinRecipient: blockchainData.iinRecipient,
              certificateBodyHash: blockchainData.certificateBodyHash,
              issuerType:
                blockchainData.issuerType === 0 ? "PERSON" : "ORGANIZATION",
              issuerHash: blockchainData.issuerHash,
              dateOfIssue: new Date(
                blockchainData.dateOfIssue * 1000
              ).toISOString(),
            }
          : null,
      },
    };
  } finally {
    await prisma.$disconnect();
  }
};
