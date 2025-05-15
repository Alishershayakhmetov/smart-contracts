import React, { useState } from "react";
import Button from "@/components/Button";
import CertificateBodyOverlay from "@/components/CertificateBodyOverlay";

interface CertificateBodyEditorProps {
    initialValue: string;
    onChange: (value: string) => void;
    readOnly?: boolean;
    theme?: "light" | "dark";
}

const CertificateBodyEditor: React.FC<CertificateBodyEditorProps> = ({
    initialValue = "",
    onChange,
    readOnly = false,
    theme = "dark",
}) => {
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [certificateBody, setCertificateBody] = useState(initialValue);

    const handleOpenOverlay = () => {
        setIsOverlayOpen(true);
    };

    const handleCloseOverlay = () => {
        setIsOverlayOpen(false);
    };

    const handleSaveContent = (content: string) => {
        setCertificateBody(content);
        onChange(content);
    };

    return (
        <div className="w-full">
            <div className="flex flex-col gap-5">
                <div
                    className="p-3 border border-borderdefault rounded-lg min-h-fit cursor-pointer hover:bg-[#2a2a2a] transition-colors"
                    onClick={handleOpenOverlay}
                >
                    {certificateBody ? (
                        <p className="line-clamp-3 whitespace-pre-line w-full">
                            {certificateBody}
                        </p>
                    ) : (
                        <p className="text-tertiary">
                            {readOnly
                                ? "No content available"
                                : "Click to add certificate content..."}
                        </p>
                    )}
                </div>

                <Button
                    title={readOnly ? "View Full Content" : "Edit Content"}
                    onClick={handleOpenOverlay}
                />
            </div>

            <CertificateBodyOverlay
                isOpen={isOverlayOpen}
                onClose={handleCloseOverlay}
                initialText={certificateBody}
                onSave={handleSaveContent}
                mode={readOnly ? "read" : "edit"}
                theme={theme}
            />
        </div>
    );
};

export default CertificateBodyEditor;
