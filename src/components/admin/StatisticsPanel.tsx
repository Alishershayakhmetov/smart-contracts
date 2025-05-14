"use client";

import { useState, useEffect } from "react";
import NoDataIcon from "../icons/NoDataIcon";

interface Statistics {
    totalUsers: number;
    totalCertificates: number;
    certificatesByMonth: {
        month: string;
        count: number;
    }[];
    topIssuers: {
        name: string;
        surname: string;
        count: number;
    }[];
    issuerTypeDistribution: {
        type: string;
        count: number;
    }[];
}

export default function StatisticsPanel() {
    const [statistics, setStatistics] = useState<Statistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/statistics");
            const data = await response.json();

            if (response.ok) {
                setStatistics(data);
            } else {
                setError(data.error || "Failed to fetch statistics");
            }
        } catch (error) {
            setError("An error occurred while fetching statistics");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!statistics) {
        return (
            <div className="flex justify-center items-center h-64">
                <NoDataIcon />
                <p>No statistics available</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Summary Cards */}
            <div className="p-5 gap-5 rounded-lg shadow-md border border-borderdefault flex flex-col">
                <h2 className="text-green text-xl font-bold">
                    System Overview
                </h2>
                <div className="flex justify-between mb-3">
                    <p>Total Users:</p>
                    <p className="font-bold">{statistics.totalUsers}</p>
                </div>
                <div className="flex justify-between">
                    <p>Total Certificates:</p>
                    <p className="font-bold">{statistics.totalCertificates}</p>
                </div>
            </div>

            {/* Monthly Certificates */}
            <div className="p-5 rounded-lg shadow-md border border-borderdefault flex flex-col gap-5">
                <h2 className="text-green text-xl font-bold">
                    Certificates by Month
                </h2>
                <div className="space-y-3">
                    {statistics.certificatesByMonth.map((item, index) => (
                        <div key={index} className="flex justify-between">
                            <p>{item.month}</p>
                            <p className="font-bold">{item.count}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Issuers */}
            {statistics.topIssuers.length > 0 && (
                <div className="flex flex-col gap-5 p-5 rounded-lg shadow-md border border-borderdefault">
                    <h2 className="text-green text-xl font-bold">
                        Top Certificate Issuers
                    </h2>
                    <div className="space-y-3">
                        {statistics.topIssuers.map((issuer, index) => (
                            <div key={index} className="flex justify-between">
                                <p>{`${issuer.name} ${issuer.surname}`}</p>
                                <p className="font-bold">{issuer.count}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Issuer Type Distribution */}
            {statistics.issuerTypeDistribution.length > 0 && (
                <div className="flex flex-col gap-5 p-5 rounded-lg shadow-md border border-borderdefault">
                    <h2 className="text-green text-xl font-bold">
                        Issuer Type Distribution
                    </h2>
                    <div className="space-y-3">
                        {statistics.issuerTypeDistribution.map(
                            (item, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between"
                                >
                                    <p>{item.type}</p>
                                    <p className="font-bold">{item.count}</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
