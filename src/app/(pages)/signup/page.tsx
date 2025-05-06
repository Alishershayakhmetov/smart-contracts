"use client";
import { Alert, Snackbar } from "@mui/material";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import BigLogo from "@/components/icons/BigLogo";
import InputField from "@/components/InputField";
import Button from "@/components/Button";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [IIN, setIIN] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        const errorParam = searchParams.get("error");
        if (errorParam) {
            setError(decodeURIComponent(errorParam));
            setOpenSnackbar(true);
        }
    }, [searchParams]);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleSubmit = async () => {
        setError("");
        setSuccess("");

        if (!email || !password || !name || !surname || !IIN) {
            setError("Please fill in all fields");
            setOpenSnackbar(true);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setOpenSnackbar(true);
            return;
        }

        try {
            const response = await axios.post("/api/auth/register", {
                email,
                password,
                name,
                surname,
                IIN,
            });

            if (response.status !== 200) {
                throw new Error(response.data || "Registration failed");
            }

            // Redirect to login with success message
            router.push(
                "/login?success=Registration successful! Please sign in"
            );
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Registration failed";
            setError(errorMessage);
            setOpenSnackbar(true);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-5">
            <BigLogo />
            <h1 className="text-5xl mt-12">Sign up</h1>
            <div className="p-6 rounded-lg border border-borderdefault w-80 space-y-4 gap-6">
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={error ? "error" : "success"}
                        sx={{ width: "100%" }}
                    >
                        {error || success}
                    </Alert>
                </Snackbar>
                <div>
                    <span>Email</span>
                    <InputField
                        type="text"
                        placeholder="Enter your email..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <span>Password</span>
                    <InputField
                        type="password"
                        placeholder="Enter your password..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <span>Name</span>
                    <InputField
                        type="text"
                        placeholder="Enter your name..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <span>Surname</span>
                    <InputField
                        type="text"
                        placeholder="Enter your surname..."
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                    />
                </div>
                <div>
                    <span>IIN</span>
                    <InputField
                        type="text"
                        placeholder="Enter your IIN..."
                        value={IIN}
                        onChange={(e) => setIIN(e.target.value)}
                    />
                </div>
                <div className="w-full [&>button]:w-full">
                    <Button
                        title="Sign up"
                        onClick={() => handleSubmit()}
                    ></Button>
                </div>
                <span>
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="underline hover:text-gray-400"
                    >
                        Sign in
                    </Link>
                </span>
            </div>
        </div>
    );
}
