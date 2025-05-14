"use client";

import { useState, useEffect } from "react";
import NoDataIcon from "../icons/NoDataIcon";
import InputField from "../InputField";
import Button from "../Button";

interface Certificate {
    id: string;
    certificateTheme: string;
    certificateBody: string;
    dateOfIssue: string;
    recipientIIN: string;
    issuerIIN: string;
    issuerType: string;
    organisationName: string | null;
    BIN: string | null;
}

export default function CertificatesPanel() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCertificate, setSelectedCertificate] =
        useState<Certificate | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        fetchCertificates();
    }, []);

    useEffect(() => {
        if (showError) {
            const timer = setTimeout(() => {
                setShowError(false);
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [showError]);

    const fetchCertificates = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/certificates");
            const data = await response.json();

            if (response.ok) {
                setCertificates(data);
            } else {
                setError(data.error || "Failed to fetch certificates");
                setShowError(true);
            }
        } catch (error) {
            setError("An error occurred while fetching certificates");
            setShowError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (certificate: Certificate) => {
        setSelectedCertificate(certificate);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const filteredCertificates = certificates.filter(
        (cert) =>
            cert.certificateTheme
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            cert.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.recipientIIN.includes(searchTerm) ||
            cert.issuerIIN.includes(searchTerm)
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5 p-5">
            {/* Error notification */}
            {showError && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
                    <div className="bg-red-800 text-white px-6 py-4 rounded-lg shadow-lg flex items-center">
                        <span>{error}</span>
                        <button
                            onClick={() => setShowError(false)}
                            className="ml-4 text-white hover:text-gray-200"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            <div>
                <InputField
                    type="text"
                    placeholder="Search certificates by title, ID, or IIN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredCertificates.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-[#4d4d4d10] rounded-lg">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-green font-bold">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-green font-bold">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-green font-bold">
                                    Recipient IIN
                                </th>
                                <th className="px-6 py-3 text-left text-green font-bold">
                                    Issuer IIN
                                </th>
                                <th className="px-6 py-3 text-left text-green font-bold">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-green font-bold">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCertificates.map((certificate) => (
                                <tr
                                    key={certificate.id}
                                    className="border-t border-borderdefault"
                                >
                                    <td className="px-6 py-4">
                                        {certificate.id.substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4">
                                        {certificate.certificateTheme}
                                    </td>
                                    <td className="px-6 py-4">
                                        {certificate.recipientIIN}
                                    </td>
                                    <td className="px-6 py-4">
                                        {certificate.issuerIIN}
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(
                                            certificate.dateOfIssue
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Button
                                            onClick={() =>
                                                handleViewDetails(certificate)
                                            }
                                            title="View"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-64">
                    <NoDataIcon />
                    <p className="mt-4 text-tertiary">No certificates found</p>
                </div>
            )}

            {/* Modal dialog */}
            {openDialog && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-[#4d4d4d] backdrop-blur-xl rounded-lg border border-borderdefault p-5 w-fit max-h-[90vh] overflow-y-auto">
                        {selectedCertificate && (
                            <>
                                <h2 className="text-green text-2xl font-bold">
                                    Certificate Details
                                </h2>
                                <div className="space-y-4 mt-2">
                                    <div>
                                        <p className="text-green font-bold">
                                            ID:
                                        </p>
                                        <p>{selectedCertificate.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-green font-bold">
                                            Title:
                                        </p>
                                        <p>
                                            {
                                                selectedCertificate.certificateTheme
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-green font-bold">
                                            Body:
                                        </p>
                                        <p>
                                            {
                                                selectedCertificate.certificateBody
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-green font-bold">
                                            Recipient IIN:
                                        </p>
                                        <p>
                                            {selectedCertificate.recipientIIN}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-green font-bold">
                                            Issuer IIN:
                                        </p>
                                        <p>{selectedCertificate.issuerIIN}</p>
                                    </div>
                                    <div>
                                        <p className="text-green font-bold">
                                            Issuer Type:
                                        </p>
                                        <p>{selectedCertificate.issuerType}</p>
                                    </div>
                                    {selectedCertificate.organisationName && (
                                        <div>
                                            <p className="text-green font-bold">
                                                Organisation Name:
                                            </p>
                                            <p>
                                                {
                                                    selectedCertificate.organisationName
                                                }
                                            </p>
                                        </div>
                                    )}
                                    {selectedCertificate.BIN && (
                                        <div>
                                            <p className="text-green font-bold">
                                                BIN:
                                            </p>
                                            <p>{selectedCertificate.BIN}</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-green font-bold">
                                            Date of Issue:
                                        </p>
                                        <p>
                                            {new Date(
                                                selectedCertificate.dateOfIssue
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleCloseDialog}
                                        title="Close"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
