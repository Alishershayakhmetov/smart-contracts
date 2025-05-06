"use client";

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Snackbar,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import NoDataIcon from "../icons/NoDataIcon";

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
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/certificates");
            const data = await response.json();

            if (response.ok) {
                setCertificates(data);
            } else {
                setError(data.error || "Failed to fetch certificates");
                setOpenSnackbar(true);
            }
        } catch (error) {
            setError("An error occurred while fetching certificates");
            setOpenSnackbar(true);
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

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
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
        <div>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity="error"
                    sx={{ width: "100%" }}
                >
                    {error}
                </Alert>
            </Snackbar>

            <div className="mb-6">
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search certificates by title, ID, or IIN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search sx={{ color: "#d9d9d9" }} />
                            </InputAdornment>
                        ),
                        sx: { color: "#d9d9d9" },
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "#4d4d4d" },
                            "&:hover fieldset": { borderColor: "#8CD813" },
                            "&.Mui-focused fieldset": {
                                borderColor: "#8CD813",
                            },
                        },
                    }}
                />
            </div>

            {filteredCertificates.length > 0 ? (
                <TableContainer
                    component={Paper}
                    sx={{ backgroundColor: "#2d2d2d", color: "#d9d9d9" }}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        color: "#8CD813",
                                        fontWeight: "bold",
                                    }}
                                >
                                    ID
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: "#8CD813",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Title
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: "#8CD813",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Recipient IIN
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: "#8CD813",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Issuer IIN
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: "#8CD813",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Date
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: "#8CD813",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredCertificates.map((certificate) => (
                                <TableRow key={certificate.id}>
                                    <TableCell sx={{ color: "#d9d9d9" }}>
                                        {certificate.id.substring(0, 8)}...
                                    </TableCell>
                                    <TableCell sx={{ color: "#d9d9d9" }}>
                                        {certificate.certificateTheme}
                                    </TableCell>
                                    <TableCell sx={{ color: "#d9d9d9" }}>
                                        {certificate.recipientIIN}
                                    </TableCell>
                                    <TableCell sx={{ color: "#d9d9d9" }}>
                                        {certificate.issuerIIN}
                                    </TableCell>
                                    <TableCell sx={{ color: "#d9d9d9" }}>
                                        {new Date(
                                            certificate.dateOfIssue
                                        ).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            onClick={() =>
                                                handleViewDetails(certificate)
                                            }
                                            sx={{
                                                backgroundColor: "#8CD813",
                                                color: "#1e1e1e",
                                                "&:hover": {
                                                    backgroundColor: "#7bc310",
                                                },
                                            }}
                                        >
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <div className="flex flex-col items-center justify-center h-64">
                    <NoDataIcon />
                    <p className="mt-4 text-tertiary">No certificates found</p>
                </div>
            )}

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                PaperProps={{
                    sx: {
                        backgroundColor: "#2d2d2d",
                        color: "#d9d9d9",
                        minWidth: "500px",
                    },
                }}
            >
                {selectedCertificate && (
                    <>
                        <DialogTitle sx={{ color: "#8CD813" }}>
                            Certificate Details
                        </DialogTitle>
                        <DialogContent>
                            <div className="space-y-4 mt-2">
                                <div>
                                    <p className="text-green font-semibold">
                                        ID:
                                    </p>
                                    <p>{selectedCertificate.id}</p>
                                </div>
                                <div>
                                    <p className="text-green font-semibold">
                                        Title:
                                    </p>
                                    <p>
                                        {selectedCertificate.certificateTheme}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-green font-semibold">
                                        Body:
                                    </p>
                                    <p>{selectedCertificate.certificateBody}</p>
                                </div>
                                <div>
                                    <p className="text-green font-semibold">
                                        Recipient IIN:
                                    </p>
                                    <p>{selectedCertificate.recipientIIN}</p>
                                </div>
                                <div>
                                    <p className="text-green font-semibold">
                                        Issuer IIN:
                                    </p>
                                    <p>{selectedCertificate.issuerIIN}</p>
                                </div>
                                <div>
                                    <p className="text-green font-semibold">
                                        Issuer Type:
                                    </p>
                                    <p>{selectedCertificate.issuerType}</p>
                                </div>
                                {selectedCertificate.organisationName && (
                                    <div>
                                        <p className="text-green font-semibold">
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
                                        <p className="text-green font-semibold">
                                            BIN:
                                        </p>
                                        <p>{selectedCertificate.BIN}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-green font-semibold">
                                        Date of Issue:
                                    </p>
                                    <p>
                                        {new Date(
                                            selectedCertificate.dateOfIssue
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={handleCloseDialog}
                                sx={{
                                    color: "#8CD813",
                                    "&:hover": {
                                        backgroundColor:
                                            "rgba(140, 216, 19, 0.1)",
                                    },
                                }}
                            >
                                Close
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </div>
    );
}
