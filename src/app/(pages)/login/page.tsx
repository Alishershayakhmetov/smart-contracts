"use client";
import { Alert, Button, Snackbar, TextField, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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

  const handleGoogleSignIn = async () => {
    const result = await signIn("google", {
      redirect: false,
      callbackUrl: "/",
    });

    if (result?.error) {
      setError(result.error);
      setOpenSnackbar(true);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-black"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <Typography variant="h4" sx={{ color: "white" }}>
        Sign In
      </Typography>
      <div
        className="bg-[#0e0e0e] p-6 rounded-md border border-gray-800 w-80 space-y-4 text-white"
        style={{ borderColor: "#444444" }}
      >
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
        <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          fullWidth
          sx={{
            backgroundColor: "white",
            color: "black",
            "&:hover": {
              backgroundColor: "#e0e0e0",
            },
            textTransform: "none",
            fontWeight: 500,
            marginBottom: "1rem",
          }}
          onClick={handleGoogleSignIn}
        >
          Continue with Google
        </Button>

        <div>
          <Typography
            variant="body2"
            className="mb-1"
            sx={{ color: "#5c5f61" }}
          >
            Email
          </Typography>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Enter your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              sx: { color: "white" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "gray",
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
              input: { color: "white" },
            }}
          />
        </div>

        <div>
          <Typography
            variant="body2"
            className="mb-1"
            sx={{ color: "#5c5f61" }}
          >
            Password
          </Typography>
          <TextField
            variant="outlined"
            fullWidth
            type="password"
            placeholder="Enter your password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              sx: { color: "white" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "gray",
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
              input: { color: "white" },
            }}
          />
        </div>

        <Button
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "white",
            color: "black",
            "&:hover": {
              backgroundColor: "#e0e0e0",
            },
            textTransform: "none",
            fontWeight: 500,
            marginBottom: "1rem",
          }}
          onClick={() => handleSubmit()}
        >
          Sign in
        </Button>

        <Typography variant="body2" align="center">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline hover:text-gray-400">
            Sign up
          </Link>
        </Typography>
      </div>
    </div>
  );
}
