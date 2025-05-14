"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, CircularProgress, Typography, Alert } from "@mui/material";
import Link from "next/link";
import { CertificateDetails } from "@/interfaces/interface";

export default function CertificateDetailPage() {
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
                <Alert severity="error" className="mb-4 max-w-md">
                    {error}
                </Alert>
                <Link href="/certificates">
                    <Button variant="outlined" color="error">
                        Back to Certificates
                    </Button>
                </Link>
            </div>
        );
    }

    if (!certificate) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center p-4">
                <Alert severity="warning" className="mb-4 max-w-md">
                    Certificate not found
                </Alert>
                <Link href="/certificates">
                    <Button variant="outlined" color="warning">
                        Back to Certificates
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen px-4 py-8">
            <div className="max-w-3xl mx-auto mt-[150]">
                {/* Certificate Details */}
                <div className="border border-gray-700 rounded-lg p-6 mb-8">
                    <h1 className="text-2xl font-bold text-green mb-4">
                        {certificate.error
                            ? `Certificate is compromised: ${certificate.error}`
                            : `Certificate is Valid`}
                    </h1>
                    <h1 className="text-2xl font-bold text-green mb-4">
                        Certificate Theme:{" "}
                        {certificate.certificateDataFromDB
                            ? certificate.certificateDataFromDB
                                  ?.certificateTheme
                            : "qw"}
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <Typography
                                variant="subtitle2"
                                className="text-gray-400"
                            >
                                Recipient IIN
                            </Typography>
                            <Typography>
                                {
                                    certificate.certificateDataFromDB
                                        ?.recipientIIN
                                }
                            </Typography>
                        </div>
                        <div>
                            <Typography
                                variant="subtitle2"
                                className="text-gray-400"
                            >
                                Issuer IIN
                            </Typography>
                            <Typography>
                                {certificate.certificateDataFromDB?.issuerIIN}
                            </Typography>
                        </div>

                        {certificate.certificateDataFromDB?.issuerType ===
                            "ORGANISATION" && (
                            <div>
                                <Typography
                                    variant="subtitle2"
                                    className="text-gray-400"
                                >
                                    Organisation
                                </Typography>
                                <Typography>
                                    {
                                        certificate.certificateDataFromDB
                                            ?.organisationName
                                    }
                                </Typography>

                                <Typography
                                    variant="subtitle2"
                                    className="text-gray-400"
                                >
                                    BIN
                                </Typography>
                                <Typography>
                                    {certificate.certificateDataFromDB?.BIN}
                                </Typography>
                            </div>
                        )}

                        <div>
                            <Typography
                                variant="subtitle2"
                                className="text-gray-400"
                            >
                                Date of Issue
                            </Typography>
                            <Typography>
                                {new Date(
                                    certificate.certificateDataFromDB?.dateOfIssue!
                                ).toLocaleDateString()}
                            </Typography>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Typography
                            variant="subtitle2"
                            className="text-gray-400 mb-2"
                        >
                            Certificate Body
                        </Typography>
                        <div className="bg-gray-900 p-4 rounded">
                            <Typography className="whitespace-pre-line">
                                {
                                    certificate.certificateDataFromDB
                                        ?.certificateBody
                                }
                            </Typography>
                        </div>
                    </div>
                </div>

                {/* Technical Details (for verification purposes) */}
                <div className="border border-gray-700 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-green mb-4">
                        Verification Details
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <Typography
                                variant="subtitle2"
                                className="text-gray-400"
                            >
                                Is Certificate Valid
                            </Typography>
                            <Typography className="font-mono break-all">
                                {certificate.verification.issuerHash ===
                                    certificate.verification
                                        .smartContractIssuerHash &&
                                certificate.verification.certificateHash ===
                                    certificate.verification
                                        .smartContractCertificateHash
                                    ? "Valid"
                                    : "Invalid"}
                            </Typography>
                        </div>
                        <div>
                            <Typography
                                variant="subtitle2"
                                className="text-gray-400"
                            >
                                Certificate ID
                            </Typography>
                            <Typography className="font-mono break-all">
                                {id}
                            </Typography>
                        </div>
                        <div>
                            <Typography
                                variant="subtitle2"
                                className="text-gray-400"
                            >
                                Issuer Hash
                            </Typography>
                            <Typography className="font-mono break-all">
                                {certificate.verification.issuerHash}
                            </Typography>
                        </div>
                        <div>
                            <Typography
                                variant="subtitle2"
                                className="text-gray-400"
                            >
                                Certificate Hash
                            </Typography>
                            <Typography className="font-mono break-all">
                                {certificate.verification.certificateHash}
                            </Typography>
                        </div>
                        <div>
                            <Typography
                                variant="subtitle2"
                                className="text-gray-400"
                            >
                                Issuer Hash From Smart-Contract
                            </Typography>
                            <Typography className="font-mono break-all">
                                {
                                    certificate.verification
                                        .smartContractIssuerHash
                                }
                            </Typography>
                        </div>
                        <div>
                            <Typography
                                variant="subtitle2"
                                className="text-gray-400"
                            >
                                Certificate Hash From Smart-Contract
                            </Typography>
                            <Typography className="font-mono break-all">
                                {
                                    certificate.verification
                                        .smartContractCertificateHash
                                }
                            </Typography>
                        </div>
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
        <Alert severity="success" className="mb-4">
          This certificate is fully validated and authentic
        </Alert>
      ) : (
        <Alert severity="warning" className="mb-4">
          Certificate validation issues detected
        </Alert>
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
      <Typography>
        {label}: {valid ? "Valid" : "Invalid"}
      </Typography>
    </div>
  );
}
*/
function LoadingScreen({ message = "Loading..." }: { message?: string }) {
    return (
        <div className="min-h-screen bg-[#0B0F0C] flex justify-center items-center">
            <div className="text-center space-y-4">
                <CircularProgress color="success" />
                <Typography className="text-green">{message}</Typography>
            </div>
        </div>
    );
}
