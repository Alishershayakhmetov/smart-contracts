import { Session } from "next-auth";
import Button from "./Button";
import { FC, MouseEvent } from "react";

type Props = {
    handleCloseModal: () => void;
    session: Session | null;
};

const ProfileDetails: FC<Props> = ({ handleCloseModal, session }) => {
    const handleOutsideClick = (e: MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleCloseModal();
        }
    };

    return (
        <>
            {/* Modal content */}
            <div
                className="fixed top-0 bottom-0 right-0 left-0 backdrop-blur-sm z-1000"
                onClick={handleOutsideClick}
            >
                <div
                    className="absolute flex flex-col items-center gap-5 top-1/2 transform left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--background)] border border-borderdefault rounded-lg p-5 w-[400px] z-1100"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="text-2xl text-green font-bold">
                        Profile details
                    </h2>

                    {session?.user && (
                        <>
                            <div className="flex flex-col w-full">
                                <span className="text-green font-bold">
                                    Your name
                                </span>
                                <span className="border border-borderdefault rounded-lg p-3">
                                    {session.user.name}
                                </span>
                            </div>
                            <div className="flex flex-col w-full">
                                <span className="text-green font-bold">
                                    Your email
                                </span>
                                <span className="border border-borderdefault rounded-lg p-3">
                                    {session.user.email}
                                </span>
                            </div>
                        </>
                    )}

                    <div className="flex justify-end">
                        <Button title="Close" onClick={handleCloseModal} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileDetails;
