"use client";

import {
  Alert,
  CircularProgress,
  MenuItem,
  Select,
  Snackbar,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import Image from "next/image";
import createCertBg from "../../../../public/images/createCertBg.png";
import CertificateBodyEditor from "@/components/CertificateBodyEditor";

export default function CreateCertificatePage() {
  const { data: session, status } = useSession();
  if (status === "unauthenticated") {
    redirect("/login");
  }

  const [recipientIIN, setRecipientIIN] = useState("");

  const [issuerType, setIssuerType] = useState("");
  const [issuerIIN, setIssuerIIN] = useState("");
  const [organisationName, setOrganisationName] = useState("");
  const [BIN, setBIN] = useState("");

  const [certificateTheme, setCertificateTheme] = useState("");
  const [certificateBody, setCertificateBody] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
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
    setIsCreating(true);

    if (
      !recipientIIN ||
      !issuerType ||
      !issuerIIN ||
      !certificateTheme ||
      !certificateBody
    ) {
      setError("Please fill in all fields");
      setOpenSnackbar(true);
      setIsCreating(false);
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
            }
          : {
              recipientIIN,
              issuerType,
              issuerIIN,
              organisationName,
              BIN,
              certificateTheme,
              certificateBody,
            };
      const response = await axios.post("/api/certificate", data);
      setSuccess("Certificate created successfully!");
      setOpenSnackbar(true);
      setIsCreating(false);

      // Reset form
      setRecipientIIN("");
      setIssuerType("");
      setIssuerIIN("");
      setOrganisationName("");
      setBIN("");
      setCertificateTheme("");
      setCertificateBody("");

      console.log(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Signing Certificate failed";
      setError(errorMessage);
      setOpenSnackbar(true);
    }
  };

  return (
    <main className="mt-44 flex flex-col items-center gap-24 relative">
      <Image
        src={createCertBg}
        alt="bg"
        className="absolute right-[300px] top-[-240px]"
      />
      {/* Main Heading */}
      <h1 className="font-bold text-green text-5xl p-5 rounded-lg bg-[#4d4d4d10] border-borderdefault backdrop-blur-xl border-[3px] w-fit top-12">
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
      <div className="flex flex-col items-center p-5 rounded-lg bg-[#4d4d4d10] border-borderdefault border-[3px] backdrop-blur-xl gap-10">
        <div className="flex gap-5 container">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-5">
              <h2 className="font-bold text-green text-2xl">
                Information about Receiver
              </h2>
              <div>
                <span>IIN of Receiver</span>
                <InputField
                  value={recipientIIN}
                  placeholder="Enter IIN of receiver..."
                  onChange={(e) => setRecipientIIN(e.target.value)}
                  type="text"
                />
              </div>
              <div className="h-[3px] min-w-full bg-borderdefault"></div>
              <div>
                <h2 className="font-bold text-green text-2xl">
                  Information about Signatory
                </h2>
                <div>
                  <span>Certificate type</span>
                  {/* I will change style of Select later... */}
                  <div className="w-full flex flex-col gap-5">
                    <Select
                      fullWidth
                      displayEmpty
                      value={issuerType}
                      onChange={(e) => setIssuerType(e.target.value)}
                      variant="outlined"
                      sx={{
                        color: "#d9d9d940",
                        ".MuiSelect-icon": {
                          color: "#4d4d4d10",
                          backgroundColor: "4d4d4d10",
                        },
                        marginBottom: "0",
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select
                      </MenuItem>
                      <MenuItem value="person">Person</MenuItem>
                      <MenuItem value="organisation">Organisation</MenuItem>
                    </Select>

                    {issuerType === "person" && (
                      <div>
                        <span>Signatory's IIN</span>
                        <InputField
                          placeholder="Enter IIN of Signatory..."
                          type="text"
                          value={issuerIIN}
                          onChange={(e) => setIssuerIIN(e.target.value)}
                        />
                      </div>
                    )}
                    {issuerType === "organisation" && (
                      <>
                        <div>
                          <span>BIN</span>
                          <InputField
                            placeholder="Enter BIN..."
                            type="text"
                            value={BIN}
                            onChange={(e) => setBIN(e.target.value)}
                          />
                        </div>
                        <div>
                          <span>Signatory's IIN</span>
                          <InputField
                            placeholder="Enter IIN of Signatory..."
                            type="text"
                            value={issuerIIN}
                            onChange={(e) => setIssuerIIN(e.target.value)}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[3px] min-h-full bg-borderdefault"></div>
          <div className="flex flex-col gap-5 w-full">
            <h2 className="font-bold text-green text-2xl">
              Certificate Details
            </h2>
            <div>
              <span>Certificate title</span>
              <InputField
                value={certificateTheme}
                placeholder="Enter Certificate title..."
                onChange={(e) => setCertificateTheme(e.target.value)}
                type="text"
              />
            </div>
            <div className="w-full">
              <span>Certificate's body</span>
              <CertificateBodyEditor
                initialValue={certificateBody}
                onChange={setCertificateBody}
                theme="dark"
              />
            </div>
          </div>
        </div>
        <div>
          <Button onClick={handleIssueCertificate} title="Issue Certificate" />
          {isCreating && (
            <div style={{ position: "relative" }}>
              <CircularProgress
                size={24}
                sx={{
                  color: "green",
                  position: "absolute",
                  top: "-34px",
                  left: "110%",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
