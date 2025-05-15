import React, { useState, useEffect, useCallback } from "react";
import Button from "@/components/Button";

interface CertificateBodyOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    initialText: string;
    onSave: (text: string) => void;
    mode: "read" | "edit";
    theme: "light" | "dark";
}

const CertificateBodyOverlay: React.FC<CertificateBodyOverlayProps> = ({
    isOpen,
    onClose,
    initialText,
    onSave,
    mode: initialMode,
    theme = "dark",
}) => {
    const [text, setText] = useState(initialText);
    const [mode, setMode] = useState<"read" | "edit">(initialMode);
    const [hasChanges, setHasChanges] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    useEffect(() => {
        setText(initialText);
        setMode(initialMode);
        setHasChanges(false);
    }, [initialText, initialMode, isOpen]);

    // Handle escape key to close overlay
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === "Escape" && isOpen) {
                handleCloseAttempt();
            }
        };

        window.addEventListener("keydown", handleEscKey);
        return () => {
            window.removeEventListener("keydown", handleEscKey);
        };
    }, [isOpen, hasChanges]);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        setHasChanges(e.target.value !== initialText);
    };

    const handleSave = () => {
        onSave(text);
        setHasChanges(false);
        onClose();
    };

    const handleCloseAttempt = () => {
        if (hasChanges && mode === "edit") {
            setShowConfirmDialog(true);
        } else {
            onClose();
        }
    };

    const handleConfirmClose = () => {
        setShowConfirmDialog(false);
        onClose();
    };

    const handleCancelClose = () => {
        setShowConfirmDialog(false);
    };

    const toggleMode = () => {
        setMode(mode === "read" ? "edit" : "read");
    };

    // Determine theme classes
    const themeClasses = {
        overlay:
            theme === "dark"
                ? "bg-[#1e1e1e] text-white"
                : "bg-white text-[#1e1e1e]",
        header:
            theme === "dark"
                ? "bg-[#2a2a2a] border-b border-borderdefault"
                : "bg-gray-100 border-b border-gray-300",
        textarea:
            theme === "dark"
                ? "bg-[#2a2a2a] text-white border-borderdefault"
                : "bg-gray-50 text-[#1e1e1e] border-gray-300",
        button:
            theme === "dark"
                ? "bg-green text-textGray hover:bg-opacity-90"
                : "bg-green text-white hover:bg-opacity-90",
        dialog:
            theme === "dark"
                ? "bg-[#2a2a2a] border border-borderdefault"
                : "bg-white border border-gray-300 shadow-lg",
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col">
            {/* Overlay background */}
            <div
                className={`flex flex-col w-full h-full ${themeClasses.overlay}`}
            >
                {/* Header */}
                <div
                    className={`p-4 flex justify-between items-center ${themeClasses.header}`}
                >
                    <h2 className="text-2xl font-bold text-green">
                        {mode === "read"
                            ? "Certificate Content"
                            : "Edit Certificate Content"}
                    </h2>
                    <div className="flex gap-4">
                        {mode === "edit" && hasChanges && (
                            <Button title="Save" onClick={handleSave} />
                        )}
                        <Button
                            title={mode === "read" ? "Edit" : "View"}
                            onClick={toggleMode}
                        />
                        <Button title="Close" onClick={handleCloseAttempt} />
                    </div>
                </div>

                {/* Content area */}
                <div className="flex-1 p-5">
                    {mode === "read" ? (
                        <div className="whitespace-pre-line text-justify p-6 border-[3px] border-borderdefault rounded-lg max-w-4xl mx-auto">
                            {text || "No content available"}
                        </div>
                    ) : (
                        <textarea
                            className={`w-full h-full p-6 rounded-lg border-[3px] resize-none focus:outline-none ${themeClasses.textarea}`}
                            value={text}
                            onChange={handleTextChange}
                            placeholder="Enter certificate content here..."
                        />
                    )}
                </div>
            </div>

            {/* Confirmation dialog */}
            {showConfirmDialog && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50"></div>
                    <div
                        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 rounded-lg z-50 w-[400px] ${themeClasses.dialog}`}
                    >
                        <h3 className="text-xl font-bold mb-4 text-green">
                            Unsaved Changes
                        </h3>
                        <p className="mb-6">
                            You have unsaved changes. Do you want to save them
                            before closing?
                        </p>
                        <div className="flex justify-end gap-4">
                            <Button
                                title="Discard"
                                onClick={handleConfirmClose}
                            />
                            <Button
                                title="Cancel"
                                onClick={handleCancelClose}
                            />
                            <Button title="Save" onClick={handleSave} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CertificateBodyOverlay;
