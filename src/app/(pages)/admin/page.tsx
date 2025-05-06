"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { Tabs, Tab, Box, Alert } from "@mui/material";
import CertificatesPanel from "@/components/admin/CertificatesPanel";
import UsersPanel from "@/components/admin/UsersPanel";
import StatisticsPanel from "@/components/admin/StatisticsPanel";

export default function AdminPage() {
    const { data: session, status } = useSession();
    const [activeTab, setActiveTab] = useState(0);
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check if user is admin
        const checkAdminStatus = async () => {
            if (status === "authenticated") {
                try {
                    console.log("Checking admin status for session:", session);
                    const response = await fetch("/api/admin/check");

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error(
                            "Admin check failed:",
                            response.status,
                            errorText
                        );
                        setError(
                            `Admin check failed: ${response.status} ${errorText}`
                        );
                        setIsLoading(false);
                        return;
                    }

                    const data = await response.json();
                    console.log("Admin check response data:", data);

                    setIsAdmin(!!data.isAdmin);
                    setIsLoading(false);

                    if (data.isAdmin === false) {
                        console.log(
                            "User is not an admin, redirecting to home"
                        );
                        setTimeout(() => redirect("/"), 100);
                    }
                } catch (error) {
                    console.error("Error checking admin status:", error);
                    setError(
                        error instanceof Error ? error.message : "Unknown error"
                    );
                    setIsLoading(false);
                }
            } else if (status === "unauthenticated") {
                console.log("User is not authenticated, redirecting to login");
                setIsLoading(false);
                setTimeout(() => redirect("/login"), 100);
            }
        };

        checkAdminStatus();
    }, [status, session]);

    // Show loading state while checking admin status
    if (status === "loading" || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green"></div>
            </div>
        );
    }

    // Show error if there was a problem checking admin status
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Alert severity="error" sx={{ maxWidth: "600px" }}>
                    {error}
                </Alert>
            </div>
        );
    }

    // If we've finished loading and the user is not an admin, show message before redirect
    if (isAdmin === false) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Alert severity="warning" sx={{ maxWidth: "600px" }}>
                    You do not have admin privileges. Redirecting to home
                    page...
                </Alert>
            </div>
        );
    }

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    return (
        <main className="min-h-screen px-4 py-8 mt-44 flex flex-col items-center gap-8">
            <h1 className="font-bold text-green text-5xl p-5 rounded-lg bg-[#4d4d4d10] border-borderdefault backdrop-blur-xl border-[3px] w-fit">
                Admin Dashboard
            </h1>

            <Box sx={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        aria-label="admin tabs"
                        sx={{
                            "& .MuiTab-root": {
                                color: "#d9d9d9",
                                fontSize: "1.1rem",
                                "&.Mui-selected": { color: "#8CD813" },
                            },
                            "& .MuiTabs-indicator": {
                                backgroundColor: "#8CD813",
                            },
                        }}
                    >
                        <Tab label="Certificates" />
                        <Tab label="Users" />
                        <Tab label="Statistics" />
                    </Tabs>
                </Box>

                <Box
                    sx={{ padding: 3 }}
                    className="bg-[#4d4d4d10] border-borderdefault border-[3px] backdrop-blur-xl rounded-lg mt-4"
                >
                    {activeTab === 0 && <CertificatesPanel />}
                    {activeTab === 1 && <UsersPanel />}
                    {activeTab === 2 && <StatisticsPanel />}
                </Box>
            </Box>
        </main>
    );
}
