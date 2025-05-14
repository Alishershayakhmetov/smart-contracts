"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Button, CircularProgress, Skeleton, Typography } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import CertificatesLoading from "@/components/certificateLoading";
import { Certificate } from "@/interfaces/interface";
import Header from "@/components/Header";
import NoDataIcon from "@/components/icons/NoDataIcon";

export default function AllUserCertificatesPage() {
    const { data: session, status } = useSession();
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            redirect("/login");
        }

        const fetchCertificates = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get("/api/certificate", {
                    withCredentials: true, // This ensures cookies are sent with the request
                });
                setCertificates(response.data);
            } catch (error) {
                console.error("Error fetching certificates:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (status === "authenticated") {
            fetchCertificates();
        }
    }, [status]);

    return (
        <main className="min-h-screen px-4 py-8">
            {/* Main Heading */}
            <h1 className="text-center text-5xl font-bold text-green mb-12 border border-borderdefault p-5 w-fit mx-auto rounded-lg mt-[150]">
                All Certificates
            </h1>

            {isLoading && CertificatesLoading()}

            <article className="max-w-5xl mx-auto flex flex-col items-center">
                {isLoading ? (
                    <div className="text-center">Loading certificates...</div>
                ) : certificates.length === 0 ? (
                    <div className="flex flex-col gap-5 items-center">
                        <NoDataIcon />
                        <h2 className="font-bold text-green text-center text-2xl">
                            No certificates found.
                        </h2>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {certificates.map((certificate) => (
                            <Link
                                href={`/certificates/${certificate.id}`}
                                key={certificate.id}
                            >
                                <div className="border border-gray-700 p-4 rounded-lg hover:border-green transition-colors">
                                    <h3 className="text-xl font-bold text-green">
                                        {certificate.certificateTheme}
                                    </h3>
                                    <p className="text-gray-300">
                                        Recipient IIN:{" "}
                                        {certificate.recipientIIN}
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        Issued on:{" "}
                                        {new Date(
                                            certificate.dateOfIssue
                                        ).toLocaleDateString()}
                                    </p>
                                    {/* Add more certificate details as needed */}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </article>
        </main>
    );
}
