"use client";

import { useState, useEffect } from "react";
import NoDataIcon from "../icons/NoDataIcon";
import Button from "../Button";
import InputField from "../InputField";

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
    const [showNotification, setShowNotification] = useState(false);
    const [isAdminSwitch, setIsAdminSwitch] = useState(false);
    const [notificationType, setNotificationType] = useState<
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
                setNotificationType("error");
                setShowNotification(true);
            }
        } catch (error) {
            setError("An error occurred while fetching users");
            setNotificationType("error");
            setShowNotification(true);
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

    const handleCloseNotification = () => {
        setShowNotification(false);
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
                setNotificationType("success");
                setShowNotification(true);
                handleCloseDialog();
            } else {
                setError(data.error || "Failed to update user");
                setNotificationType("error");
                setShowNotification(true);
            }
        } catch (error) {
            setError("An error occurred while updating user");
            setNotificationType("error");
            setShowNotification(true);
        }
    };

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.iin && user.iin.includes(searchTerm))
    );

    // Auto-hide notification after timeout
    useEffect(() => {
        if (!showNotification) return;

        const timer = setTimeout(() => setShowNotification(false), 6000);
        return () => clearTimeout(timer);
    }, [showNotification]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5 p-5">
            {/* Notification */}
            {showNotification && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
                    <div
                        className={`${
                            notificationType === "error"
                                ? "bg-red-800"
                                : "bg-green-800"
                        } text-white px-6 py-4 rounded-lg shadow-lg flex items-center`}
                    >
                        <span>
                            {notificationType === "error" ? error : success}
                        </span>
                        <button
                            onClick={handleCloseNotification}
                            className="ml-4 text-white hover:text-gray-200"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            <InputField
                type="text"
                placeholder="Search users by name, email, or IIN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {filteredUsers.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full rounded-lg bg-[#4d4d4d10]">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-green font-bold">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-green font-bold">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-green font-bold">
                                    IIN
                                </th>
                                <th className="px-6 py-3 text-left text-green font-bold">
                                    Admin
                                </th>
                                <th className="px-6 py-3 text-left text-green font-bold">
                                    Certificates
                                </th>
                                <th className="px-6 py-3 text-left text-green font-bold">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-t border-borderdefault"
                                >
                                    <td className="px-6 py-4">{`${user.name} ${user.surname}`}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">
                                        {user.iin || "Not set"}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.isAdmin ? "Yes" : "No"}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user._count
                                            ? `Issued: ${user._count.issuedCertificates}, Received: ${user._count.receivedCertificates}`
                                            : "N/A"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Button
                                            title="Manage"
                                            onClick={() =>
                                                handleViewDetails(user)
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-64">
                    <NoDataIcon />
                    <p className="mt-4 text-tertiary">No users found</p>
                </div>
            )}

            {/* Modal Dialog */}
            {openDialog && (
                <div className="fixed inset-0 z-50 overflow-auto flex items-center justify-center">
                    <div className="p-5 bg-[#4d4d4d] rounded-lg w-full max-w-md">
                        {selectedUser && (
                            <>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-green text-xl font-bold">
                                        User Management
                                    </h2>
                                    <button
                                        onClick={handleCloseDialog}
                                        className="text-[#d9d9d9] hover:text-green"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="space-y-4 mt-2">
                                    <div>
                                        <p className="text-green font-bold">
                                            Name:
                                        </p>
                                        <p>{`${selectedUser.name} ${selectedUser.surname}`}</p>
                                    </div>
                                    <div>
                                        <p className="text-green font-bold">
                                            Email:
                                        </p>
                                        <p>{selectedUser.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-green font-bold">
                                            IIN:
                                        </p>
                                        <p>{selectedUser.iin || "Not set"}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={isAdminSwitch}
                                                onChange={(e) =>
                                                    setIsAdminSwitch(
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                            <div className="relative w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green"></div>
                                            <span className="ms-3 text-sm font-bold">
                                                Admin Status
                                            </span>
                                        </label>
                                    </div>
                                    {selectedUser._count && (
                                        <div>
                                            <p className="text-green font-bold">
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

                                <div className="flex justify-end gap-4 mt-6">
                                    <Button
                                        onClick={handleCloseDialog}
                                        title="Cancel"
                                    />
                                    <Button
                                        title="Save Changes"
                                        onClick={handleUpdateAdminStatus}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
