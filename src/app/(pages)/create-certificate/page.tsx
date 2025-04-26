"use client";

import {
  Alert,
  Box,
  Button,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function CreateCertificatePage() {
  const [recipientIIN, setRecipientIIN] = useState("");

  const [issuerType, setIssuerType] = useState("");
  const [issuerIIN, setIssuerIIN] = useState("");
  const [organisationName, setOrganisationName] = useState("");
  const [BIN, setBIN] = useState("");

  const [certificateTheme, setCertificateTheme] = useState("");
  const [certificateBody, setCertificateBody] = useState("");
  const [dateOfIssue, setDateOfIssue] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const searchParams = useSearchParams();

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

  const handleIssueCertificate = async () => {
    setError("");
    setSuccess("");

    if (
      !recipientIIN ||
      !issuerType ||
      !issuerIIN ||
      !certificateTheme ||
      !certificateBody ||
      !dateOfIssue
    ) {
      setError("Please fill in all fields");
      setOpenSnackbar(true);
      return;
    }

    try {
      const data =
        issuerType === "PERSON"
          ? {
              recipientIIN,
              issuerType,
              issuerIIN,
              certificateTheme,
              certificateBody,
              dateOfIssue,
            }
          : {
              recipientIIN,
              issuerType,
              issuerIIN,
              organisationName,
              BIN,
              certificateTheme,
              certificateBody,
              dateOfIssue,
            };
      const response = await axios.post("/api/certificate", data);
      console.log(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Signing Certificate failed";
      setError(errorMessage);
      setOpenSnackbar(true);
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0F0C] text-white px-4 py-8">
      {/* Header */}
      <header className="flex justify-between items-center bg-[#0B0F0C] px-6 py-4 border border-gray-700 rounded-xl max-w-5xl mx-auto mb-12">
        <div className="flex items-center space-x-1 text-xl font-semibold">
          <span className="bg-lime-500 text-black px-1 rounded">Smart</span>
          <span>Contracts</span>
        </div>
        <nav className="flex items-center gap-8 text-sm">
          <Link href="#" className="hover:text-lime-400">
            Home
          </Link>
          <Link href="#" className="text-lime-400">
            Create Certificate
          </Link>
          <Link href="#">About us</Link>
        </nav>
        <Link href="signup" className="text-lime-400">
          <Button
            variant="outlined"
            className="text-lime-400 border-lime-400 hover:bg-lime-400 hover:text-black transition-all"
          >
            Sign up
          </Button>
        </Link>
      </header>

      {/* Main Heading */}
      <h1 className="text-center text-3xl font-bold text-lime-400 mb-12 border border-lime-400 py-4 max-w-md mx-auto rounded-md">
        Create Certificate
      </h1>

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

      {/* Form Section */}
      <div style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
        {/* Receiver Info */}
        <Box className="bg-[#101410] border border-lime-400 p-6 rounded-md max-w-3xl mx-auto w-full space-y-6">
          <Typography
            className="text-lime-400 text-lg font-semibold mb-4"
            sx={{ marginBottom: "8px" }}
          >
            Information about Receiver
          </Typography>

          <div className="space-y-4 flex flex-col gap-4">
            <TextField
              fullWidth
              label="IIN of Receiver"
              value={recipientIIN}
              onChange={(e) => setRecipientIIN(e.target.value)}
              placeholder="Enter IIN of receiver..."
              variant="outlined"
              InputProps={{
                style: { backgroundColor: "#1A1F1A", color: "white" },
              }}
              InputLabelProps={{
                style: { color: "#999" },
              }}
            />
          </div>
        </Box>

        {/* Issuer Info */}
        <Box className="bg-[#101410] border border-lime-400 p-6 rounded-md max-w-3xl mx-auto w-full space-y-6">
          <Typography
            className="text-lime-400 text-lg font-semibold"
            sx={{ marginBottom: "8px" }}
          >
            Information about Issuer
          </Typography>

          <div className="space-y-4 flex flex-col gap-4">
            <Select
              fullWidth
              displayEmpty
              value={issuerType}
              onChange={(e) => setIssuerType(e.target.value)}
              variant="outlined"
              sx={{
                backgroundColor: "#1A1F1A",
                color: "white",
                ".MuiSelect-icon": { color: "white" },
                marginBottom: "0",
              }}
            >
              <MenuItem value="" disabled>
                Select Issuer Type
              </MenuItem>
              <MenuItem value="person">Person</MenuItem>
              <MenuItem value="organisation">Organisation</MenuItem>
            </Select>

            {issuerType === "person" && (
              <>
                <TextField
                  fullWidth
                  label="IIN of Issuer"
                  placeholder="Enter IIN of Issuer..."
                  value={issuerIIN}
                  onChange={(e) => setIssuerIIN(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    style: { backgroundColor: "#1A1F1A", color: "white" },
                  }}
                  InputLabelProps={{
                    style: { color: "#999" },
                  }}
                />
              </>
            )}

            {issuerType === "organisation" && (
              <>
                <TextField
                  fullWidth
                  label="Organisation Name"
                  placeholder="Enter Name of Organisation..."
                  value={organisationName}
                  onChange={(e) => setOrganisationName(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    style: { backgroundColor: "#1A1F1A", color: "white" },
                  }}
                  InputLabelProps={{
                    style: { color: "#999" },
                  }}
                />
                <TextField
                  fullWidth
                  label="BIN"
                  placeholder="Enter BIN..."
                  value={BIN}
                  onChange={(e) => setBIN(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    style: { backgroundColor: "#1A1F1A", color: "white" },
                  }}
                  InputLabelProps={{
                    style: { color: "#999" },
                  }}
                />
                <TextField
                  fullWidth
                  label="IIN of Issuer"
                  placeholder="Enter IIN of Issuer..."
                  value={issuerIIN}
                  onChange={(e) => setIssuerIIN(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    style: { backgroundColor: "#1A1F1A", color: "white" },
                  }}
                  InputLabelProps={{
                    style: { color: "#999" },
                  }}
                />
              </>
            )}
          </div>
        </Box>
      </div>

      {/* Certificate Info */}
      <Box className="bg-[#101410] border border-lime-400 p-6 rounded-md max-w-3xl mx-auto w-full space-y-6 mt-8">
        <Typography
          className="text-lime-400 text-lg font-semibold mb-4"
          sx={{ marginBottom: "8px" }}
        >
          Certificate Details
        </Typography>

        <div className="space-y-4 flex flex-col gap-4">
          <TextField
            fullWidth
            label="Certificate Theme"
            placeholder="Enter Certificate Theme..."
            value={certificateTheme}
            onChange={(e) => setCertificateTheme(e.target.value)}
            variant="outlined"
            InputProps={{
              style: { backgroundColor: "#1A1F1A", color: "white" },
            }}
            InputLabelProps={{
              style: { color: "#999" },
            }}
          />
          <TextField
            fullWidth
            label="Certificate Body"
            placeholder="Enter Certificate Body..."
            value={certificateBody}
            onChange={(e) => setCertificateBody(e.target.value)}
            variant="outlined"
            InputProps={{
              style: { backgroundColor: "#1A1F1A", color: "white" },
            }}
            InputLabelProps={{
              style: { color: "#999" },
            }}
          />
          <TextField
            fullWidth
            type="date"
            label="Date of Issue"
            value={dateOfIssue}
            onChange={(e) => setDateOfIssue(e.target.value)}
            InputLabelProps={{
              shrink: true,
              style: { color: "#999" },
            }}
            InputProps={{
              style: { backgroundColor: "#1A1F1A", color: "white" },
            }}
          />
        </div>
      </Box>

      <Button onClick={handleIssueCertificate}>Issue Certificate</Button>
    </main>
  );
}
