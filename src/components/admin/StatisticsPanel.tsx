"use client";

import { useState, useEffect } from "react";
import { Grid, Paper, Typography, Box, CircularProgress } from "@mui/material";

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
                <CircularProgress sx={{ color: "#8CD813" }} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <Typography color="error">{error}</Typography>
            </div>
        );
    }

    if (!statistics) {
        return (
            <div className="flex justify-center items-center h-64">
                <Typography color="#d9d9d9">No statistics available</Typography>
            </div>
        );
    }

    return (
        <Grid container spacing={3}>
            {/* Summary Cards */}
            <div>
                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        backgroundColor: "#2d2d2d",
                        color: "#d9d9d9",
                        height: "100%",
                    }}
                >
                    <Typography variant="h6" sx={{ color: "#8CD813", mb: 2 }}>
                        System Overview
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 2,
                        }}
                    >
                        <Typography>Total Users:</Typography>
                        <Typography sx={{ fontWeight: "bold" }}>
                            {statistics.totalUsers}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography>Total Certificates:</Typography>
                        <Typography sx={{ fontWeight: "bold" }}>
                            {statistics.totalCertificates}
                        </Typography>
                    </Box>
                </Paper>
            </div>

            {/* Monthly Certificates */}
            <div>
                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        backgroundColor: "#2d2d2d",
                        color: "#d9d9d9",
                        height: "100%",
                    }}
                >
                    <Typography variant="h6" sx={{ color: "#8CD813", mb: 2 }}>
                        Certificates by Month
                    </Typography>
                    <div className="space-y-2">
                        {statistics.certificatesByMonth.map((item, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Typography>{item.month}</Typography>
                                <Typography sx={{ fontWeight: "bold" }}>
                                    {item.count}
                                </Typography>
                            </Box>
                        ))}
                    </div>
                </Paper>
            </div>
        </Grid>
    );
}
