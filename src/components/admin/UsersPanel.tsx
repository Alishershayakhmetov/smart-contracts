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
    Switch,
    FormControlLabel,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import NoDataIcon from "../icons/NoDataIcon";

interface User {
    id: string;
    name: string;
    surname: string;
    email: string;
    iin: string | null;
    isAdmin: boolean;
    _count?: {
        issuedCertificates: number;
        receivedCertificates: number;
    };
}

export default function UsersPanel() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [isAdminSwitch, setIsAdminSwitch] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState<
        "error" | "success"
    >("error");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/users");
            const data = await response.json();

            if (response.ok) {
                setUsers(data);
            } else {
                setError(data.error || "Failed to fetch users");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            }
        } catch (error) {
            setError("An error occurred while fetching users");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (user: User) => {
        setSelectedUser(user);
        setIsAdminSwitch(user.isAdmin);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleUpdateAdminStatus = async () => {
        if (!selectedUser) return;

        try {
            const response = await fetch(
                `/api/admin/users/${selectedUser.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ isAdmin: isAdminSwitch }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                // Update the user in the local state
                setUsers(
                    users.map((user) =>
                        user.id === selectedUser.id
                            ? { ...user, isAdmin: isAdminSwitch }
                            : user
                    )
                );

                setSuccess(
                    `User ${selectedUser.name} ${selectedUser.surname} admin status updated successfully`
                );
                setSnackbarSeverity("success");
                setOpenSnackbar(true);
                handleCloseDialog();
            } else {
                setError(data.error || "Failed to update user");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            }
        } catch (error) {
            setError("An error occurred while updating user");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.iin && user.iin.includes(searchTerm))
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
                    severity={snackbarSeverity}
                    sx={{ width: "100%" }}
                >
                    {snackbarSeverity === "error" ? error : success}
                </Alert>
            </Snackbar>

            <div className="mb-6">
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search users by name, email, or IIN..."
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

            {filteredUsers.length > 0 ? (
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
                                    Name
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: "#8CD813",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Email
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: "#8CD813",
                                        fontWeight: "bold",
                                    }}
                                >
                                    IIN
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: "#8CD813",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Admin
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: "#8CD813",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Certificates
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
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell
                                        sx={{ color: "#d9d9d9" }}
                                    >{`${user.name} ${user.surname}`}</TableCell>
                                    <TableCell sx={{ color: "#d9d9d9" }}>
                                        {user.email}
                                    </TableCell>
                                    <TableCell sx={{ color: "#d9d9d9" }}>
                                        {user.iin || "Not set"}
                                    </TableCell>
                                    <TableCell sx={{ color: "#d9d9d9" }}>
                                        {user.isAdmin ? "Yes" : "No"}
                                    </TableCell>
                                    <TableCell sx={{ color: "#d9d9d9" }}>
                                        {user._count
                                            ? `Issued: ${user._count.issuedCertificates}, Received: ${user._count.receivedCertificates}`
                                            : "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            onClick={() =>
                                                handleViewDetails(user)
                                            }
                                            sx={{
                                                backgroundColor: "#8CD813",
                                                color: "#1e1e1e",
                                                "&:hover": {
                                                    backgroundColor: "#7bc310",
                                                },
                                            }}
                                        >
                                            Manage
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
                    <p className="mt-4 text-tertiary">No users found</p>
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
                {selectedUser && (
                    <>
                        <DialogTitle sx={{ color: "#8CD813" }}>
                            User Management
                        </DialogTitle>
                        <DialogContent>
                            <div className="space-y-4 mt-2">
                                <div>
                                    <p className="text-green font-semibold">
                                        Name:
                                    </p>
                                    <p>{`${selectedUser.name} ${selectedUser.surname}`}</p>
                                </div>
                                <div>
                                    <p className="text-green font-semibold">
                                        Email:
                                    </p>
                                    <p>{selectedUser.email}</p>
                                </div>
                                <div>
                                    <p className="text-green font-semibold">
                                        IIN:
                                    </p>
                                    <p>{selectedUser.iin || "Not set"}</p>
                                </div>
                                <div>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={isAdminSwitch}
                                                onChange={(e) =>
                                                    setIsAdminSwitch(
                                                        e.target.checked
                                                    )
                                                }
                                                sx={{
                                                    "& .MuiSwitch-switchBase.Mui-checked":
                                                        {
                                                            color: "#8CD813",
                                                            "&:hover": {
                                                                backgroundColor:
                                                                    "rgba(140, 216, 19, 0.08)",
                                                            },
                                                        },
                                                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                                        {
                                                            backgroundColor:
                                                                "#8CD813",
                                                        },
                                                }}
                                            />
                                        }
                                        label="Admin Status"
                                    />
                                </div>
                                {selectedUser._count && (
                                    <div>
                                        <p className="text-green font-semibold">
                                            Certificates:
                                        </p>
                                        <p>
                                            Issued:{" "}
                                            {
                                                selectedUser._count
                                                    .issuedCertificates
                                            }
                                        </p>
                                        <p>
                                            Received:{" "}
                                            {
                                                selectedUser._count
                                                    .receivedCertificates
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={handleCloseDialog}
                                sx={{
                                    color: "#d9d9d9",
                                    "&:hover": {
                                        backgroundColor:
                                            "rgba(217, 217, 217, 0.1)",
                                    },
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleUpdateAdminStatus}
                                sx={{
                                    backgroundColor: "#8CD813",
                                    color: "#1e1e1e",
                                    "&:hover": { backgroundColor: "#7bc310" },
                                }}
                            >
                                Save Changes
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </div>
    );
}
