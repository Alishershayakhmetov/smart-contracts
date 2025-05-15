"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { CertificateDetails } from "@/interfaces/interface";

export default function CertificateDetailPage() {
    const router = useRouter();
    const { id } = useParams();
    const [certificate, setCertificate] = useState<CertificateDetails | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCertificateData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await axios.get(`/api/certificate/${id}`);

                setCertificate(response.data);
            } catch (err) {
                console.error("Error fetching certificate:", err);
                setError("Failed to load certificate data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCertificateData();
    }, [id]);

    if (isLoading) {
        return <LoadingScreen message="Loading certificate details..." />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center p-4">
                <div className="bg-red-500 text-white p-4 rounded-lg mb-4 max-w-md">
                    {error}
                </div>
                <button
                    className="bg-green text-textGray px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all"
                    onClick={() => router.push("/certificates")}
                >
                    Back to Certificates
                </button>
            </div>
        );
    }

    if (!certificate) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center p-4">
                <div className="bg-yellow-500 text-white p-4 rounded-lg mb-4 max-w-md">
                    Certificate not found
                </div>
                <button
                    className="bg-green text-textGray px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all"
                    onClick={() => router.push("/certificates")}
                >
                    Back to Certificates
                </button>
            </div>
        );
    }

    return (
        <main className="min-h-screen mt-56">
            <div className="max-w-3xl mx-auto flex flex-col gap-5">
                {/* Certificate Details */}
                <div className="border-[3px] border-borderdefault rounded-lg p-5 flex flex-col gap-5">
                    <h1
                        className={`text-2xl font-bold ${
                            certificate.error ? "text-red-500" : "text-green"
                        }`}
                    >
                        {certificate.error
                            ? `Certificate is compromised: ${certificate.error}`
                            : `Certificate is Valid`}
                    </h1>
                    <h1 className="text-2xl font-bold text-green">
                        Certificate Theme:{" "}
                        {certificate.certificateDataFromDB
                            ? certificate.certificateDataFromDB
                                  ?.certificateTheme
                            : "qw"}
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-tertiary">Recipient IIN</p>
                            <p className="select-all">
                                {
                                    certificate.certificateDataFromDB
                                        ?.recipientIIN
                                }
                            </p>
                        </div>
                        <div>
                            <p className="text-tertiary">Issuer IIN</p>
                            <p className="select-all">
                                {certificate.certificateDataFromDB?.issuerIIN}
                            </p>
                        </div>

                        {certificate.certificateDataFromDB?.issuerType ===
                            "ORGANISATION" && (
                            <div>
                                <p className="text-tertiary">Organisation</p>
                                <p className="select-all">
                                    {
                                        certificate.certificateDataFromDB
                                            ?.organisationName
                                    }
                                </p>
                                <p className="text-tertiary">BIN</p>
                                <p className="select-all">
                                    {certificate.certificateDataFromDB?.BIN}
                                </p>
                            </div>
                        )}

                        <div>
                            <p className="text-tertiary">Date of Issue</p>
                            <p className="select-all">
                                {new Date(
                                    certificate.certificateDataFromDB?.dateOfIssue!
                                ).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <div className="">
                        <p className="text-tertiary">Certificate Body</p>
                        <div className="p-5 border border-borderdefault rounded-lg">
                            <p className="whitespace-pre-line text-justify">
                                {
                                    certificate.certificateDataFromDB
                                        ?.certificateBody
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Technical Details (for verification purposes) */}
                <div className="border-[3px] border-borderdefault rounded-lg p-5 flex flex-col gap-5">
                    <h2 className="text-xl font-bold text-green">
                        Verification Details
                    </h2>
                    <div>
                        <p className="text-tertiary">Is Certificate Valid</p>
                        <p className="font-mono break-all">
                            {certificate.verification.issuerHash ===
                                certificate.verification
                                    .smartContractIssuerHash &&
                            certificate.verification.certificateHash ===
                                certificate.verification
                                    .smartContractCertificateHash
                                ? "Valid"
                                : "Invalid"}
                        </p>
                    </div>
                    <div>
                        <p className="text-tertiary">Certificate ID</p>
                        <p className="font-mono break-all select-all">{id}</p>
                    </div>
                    <div>
                        <p className="text-tertiary">Issuer Hash</p>
                        <p className="font-mono break-all select-all">
                            {certificate.verification.issuerHash}
                        </p>
                    </div>
                    <div>
                        <p className="text-tertiary">Certificate Hash</p>
                        <p className="font-mono break-all select-all">
                            {certificate.verification.certificateHash}
                        </p>
                    </div>
                    <div>
                        <p className="text-tertiary">
                            Issuer Hash From Smart-Contract
                        </p>
                        <p className="font-mono break-all select-all">
                            {certificate.verification.smartContractIssuerHash}
                        </p>
                    </div>
                    <div>
                        <p className="text-tertiary">
                            Certificate Hash From Smart-Contract
                        </p>
                        <p className="font-mono break-all select-all">
                            {
                                certificate.verification
                                    .smartContractCertificateHash
                            }
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

/*
function ValidationStatus({validation}: {validation: }) {
  if (!validation) return null;

  const allValid =
    validation.dbValid &&
    validation.contractValid &&
    validation.hashMatch &&
    validation.issuerValid;

  return (
    <div className="mb-8">
      {allValid ? (
        <div className="bg-green bg-opacity-20 border border-green text-green p-4 rounded-lg mb-4">
          This certificate is fully validated and authentic
        </div>
      ) : (
        <div className="bg-yellow-500 bg-opacity-20 border border-yellow-500 text-yellow-500 p-4 rounded-lg mb-4">
          Certificate validation issues detected
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ValidationItem label="Database Record" valid={validation.dbValid} />
        <ValidationItem
          label="Smart Contract Record"
          valid={validation.contractValid}
        />
        <ValidationItem label="Hash Match" valid={validation.hashMatch} />
        <ValidationItem
          label="Issuer Verification"
          valid={validation.issuerValid}
        />
      </div>
    </div>
  );
}

function ValidationItem({ label, valid }: { label: string; valid: boolean }) {
  return (
    <div className="flex items-center space-x-2">
      <div
        className={`w-4 h-4 rounded-full ${
          valid ? "bg-green" : "bg-red-500"
        }`}
      />
      <p>
        {label}: {valid ? "Valid" : "Invalid"}
      </p>
    </div>
  );
}
*/

function LoadingScreen({ message = "Loading..." }: { message?: string }) {
    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green mx-auto"></div>
                <p className="text-green">{message}</p>
            </div>
        </div>
    );
}
