"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "../../../components/Button";
import { Alert, Snackbar } from "@mui/material";
import InputField from "../../../components/InputField";
import BigLogo from "@/components/icons/BigLogo";

// Regex pattern for email
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const IIN_REGEX = /^\d{12}$/;

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);

    // Handle callback errors (e.g., from registration)
    useEffect(() => {
        const errorParam = searchParams.get("error");
        const successParam = searchParams.get("success");

        if (errorParam) {
            setError(decodeURIComponent(errorParam));
            setOpenSnackbar(true);
        }

        if (successParam) {
            setSuccess(decodeURIComponent(successParam));
            setOpenSnackbar(true);
        }
    }, [searchParams]);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleSubmit = async () => {
        setError("");
        setSuccess("");

        if (!email || !password) {
            setError("Please fill in all fields");
            setOpenSnackbar(true);
            return;
        }

        if (!EMAIL_REGEX.test(email)) {
            setError("Please enter a valid email address");
            setOpenSnackbar(true);
            return;
        }

        if (!IIN_REGEX.test(password)) {
            setError("Password must be a valid IIN consisting of 12 digits");
            setOpenSnackbar(true);
            return;
        }

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            let errorMessage = result.error;

            // Customize error messages for specific cases
            if (result.error.includes("CredentialsSignin")) {
                errorMessage = "Invalid email or password";
            } else if (result.error.includes("User not found")) {
                errorMessage = "No account found with this email";
            } else if (result.error.includes("Incorrect password")) {
                errorMessage = "Incorrect password";
            }

            setError(errorMessage);
            setOpenSnackbar(true);
        } else {
            router.push("/");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-5">
            <BigLogo />
            <h1 className="text-5xl mt-12">Sign in</h1>
            <div className="p-6 border border-borderdefault rounded-lg w-80 space-y-4 gap-6">
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
                <div className="w-full [&>button]:w-full">
                    <Button onClick={() => handleSubmit()} title="Sign in" />
                </div>
                <span>
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/signup"
                        className="underline hover:text-tertiary"
                    >
                        Sign up
                    </Link>
                </span>
            </div>
        </div>
    );
}
