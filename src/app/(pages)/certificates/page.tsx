"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Button, CircularProgress, Skeleton, Typography } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import CertificatesLoading from "@/components/certificateLoading";
import { Certificate } from "@/interfaces/interface";
import Header from "@/components/header";

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
    <main className="min-h-screen bg-[#0B0F0C] text-white px-4 py-8">
      {/* Header */}
      <Header />

      {/* Main Heading */}
      <h1 className="text-center text-3xl font-bold text-lime-400 mb-12 border border-lime-400 py-4 max-w-md mx-auto rounded-md">
        All Certificates
      </h1>

      {isLoading && CertificatesLoading()}

      <article className="max-w-5xl mx-auto">
        {isLoading ? (
          <div className="text-center">Loading certificates...</div>
        ) : certificates.length === 0 ? (
          <div className="text-center">No certificates found</div>
        ) : (
          <div className="grid gap-4">
            {certificates.map((certificate) => (
              <Link
                href={`/certificates/${certificate.id}`}
                key={certificate.id}
              >
                <div className="border border-gray-700 p-4 rounded-lg hover:border-lime-400 transition-colors">
                  <h3 className="text-xl font-semibold text-lime-400">
                    {certificate.certificateTheme}
                  </h3>
                  <p className="text-gray-300">
                    Recipient IIN: {certificate.recipientIIN}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Issued on:{" "}
                    {new Date(certificate.dateOfIssue).toLocaleDateString()}
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
