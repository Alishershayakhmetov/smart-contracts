"use client";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import CertificatesLoading from "@/components/certificateLoading";
import { Certificate } from "@/interfaces/interface";
import NoDataIcon from "@/components/icons/NoDataIcon";
import Button from "@/components/Button";
import Image from "next/image";
import CertsBG from "../../../../public/images/CertsBG.png";

export default function AllUserCertificatesPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [receivedCertificates, setReceivedCertificates] = useState<
        Certificate[]
    >([]);
    const [createdCertificates, setCreatedCertificates] = useState<
        Certificate[]
    >([]);

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

                // Split certificates into received and created
                if (session?.user?.id) {
                    // Fetch the user's IIN from the database
                    try {
                        const userResponse = await axios.get(
                            "/api/user/current"
                        );
                        const userIIN = userResponse.data.iin;

                        if (userIIN) {
                            const received = response.data.filter(
                                (cert: Certificate) =>
                                    cert.recipientIIN === userIIN &&
                                    cert.issuerIIN !== userIIN
                            );
                            const created = response.data.filter(
                                (cert: Certificate) =>
                                    cert.issuerIIN === userIIN
                            );

                            setReceivedCertificates(received);
                            setCreatedCertificates(created);
                        }
                    } catch (error) {
                        console.error("Error fetching user data:", error);
                    }
                }
            } catch (error) {
                console.error("Error fetching certificates:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (status === "authenticated") {
            fetchCertificates();
        }
    }, [status, session]);

    const renderCertificateList = (
        certificateList: Certificate[],
        title: string
    ) => {
        return (
            <div className="flex flex-col w-full border-[3px] border-borderdefault rounded-lg p-5 gap-5 bg-[#4d4d4d10] backdrop-blur-xl h-full">
                <h2 className="text-5xl font-bold text-green mb-6 text-center">
                    {title}
                </h2>

                {certificateList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center">
                        <NoDataIcon />
                        <h2 className="font-bold text-green text-center text-2xl mt-4">
                            No certificates found.
                        </h2>
                    </div>
                ) : (
                    <>
                        {certificateList.map((certificate) => (
                            <div
                                className="flex flex-col items-center gap-5 p-5 rounded-lg border-[3px] border-borderdefault"
                                key={certificate.id}
                            >
                                <h3 className="text-2xl text-green">
                                    {certificate.certificateTheme}
                                </h3>
                                <p className="blur-[2.5px] truncate text-justify text-wrap w-full">
                                    {certificate.certificateBody}
                                </p>
                                <Button
                                    title="View full information"
                                    onClick={() =>
                                        router.push(
                                            `certificates/${certificate.id}`
                                        )
                                    }
                                />
                                <p className="text-tertiary">
                                    {title === "Received by you"
                                        ? "Issuer"
                                        : "Recipient"}{" "}
                                    IIN:{" "}
                                    {title === "Received by you"
                                        ? certificate.issuerIIN
                                        : certificate.recipientIIN}
                                </p>
                                <p className="text-tertiary">
                                    Issued on:{" "}
                                    {new Date(
                                        certificate.dateOfIssue
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </>
                )}
            </div>
        );
    };

    return (
        <main className="flex flex-col items-center relative gap-12">
            <div className="mb-12 bg-[#4d4d4d10] backdrop-blur-xl border-[3px] border-borderdefault p-5 w-fit rounded-lg mt-56">
                <h1 className="text-5xl font-bold text-green">
                    Your Certificates
                </h1>
            </div>

            {/* Background image only shows after loading is complete */}
            {!isLoading && (
                <Image
                    src={CertsBG}
                    alt="bg"
                    className="absolute left-1/2 -translate-x-1/2 top-[270px] -z-10"
                    priority={false}
                />
            )}

            {isLoading ? (
                <CertificatesLoading />
            ) : (
                <article className="flex justify-between gap-12 container">
                    {certificates.length === 0 ? (
                        <div className="flex flex-col gap-5 items-center">
                            <NoDataIcon />
                            <h2 className="font-bold text-green text-center text-2xl">
                                No certificates found.
                            </h2>
                        </div>
                    ) : (
                        <>
                            {renderCertificateList(
                                receivedCertificates,
                                "Received by you"
                            )}
                            {renderCertificateList(
                                createdCertificates,
                                "Created by you"
                            )}
                        </>
                    )}
                </article>
            )}
        </main>
    );
}
