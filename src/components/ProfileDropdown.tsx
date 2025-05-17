import Button from "@/components/Button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, FC } from "react";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import ProfileIcon from "./icons/ProfileIcon";
import ButtonWithIcon from "./ButtonWithIcon";

type Props = {
    name: string;
};

const ProfileDropdown: FC<Props> = ({ name }) => {
    const router = useRouter();
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                buttonRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleProfileClick = () => {
        setOpenModal(true);
        setIsMenuOpen(false);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleLogout = async () => {
        try {
            await signOut({ redirect: false });
            router.refresh();
            router.push("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="relative">
            <ButtonWithIcon
                onClick={handleClick}
                title={name}
                icon={<ProfileIcon />}
            />

            {isMenuOpen && (
                <div
                    ref={menuRef}
                    className="absolute right-0 w-full bg-[#4d4d4d10] backdrop-blur-xl rounded-lg z-10 flex flex-col pt-2.5 pb-2.5"
                >
                    <ul className="flex flex-col gap-2.5 items-center w-full">
                        <li
                            className="cursor-pointer w-fit hover:text-green"
                            onClick={() => {
                                router.push("/admin");
                                setIsMenuOpen(false);
                            }}
                        >
                            Admin dashboard
                        </li>
                        <li
                            className="cursor-pointer w-fit hover:text-green"
                            onClick={handleProfileClick}
                        >
                            Profile details
                        </li>
                        <li
                            className="cursor-pointer hover:text-green"
                            onClick={() => {
                                router.push("/certificates");
                                setIsMenuOpen(false);
                            }}
                        >
                            Certificates
                        </li>
                        <li
                            className="cursor-pointer hover:text-green"
                            onClick={handleLogout}
                        >
                            Log out
                        </li>
                    </ul>
                </div>
            )}

            {openModal && renderModal(openModal, handleCloseModal, session)}
        </div>
    );
};

export default ProfileDropdown;

function renderModal(
    openModal: boolean,
    handleCloseModal: () => void,
    session: Session | null
) {
    if (!openModal) return null;

    return (
        <>
            {/* Modal backdrop */}
            <div className="fixed inset-0 z-40" onClick={handleCloseModal} />

            {/* Modal content */}
            <div className="flex flex-col items-center gap-5 fixed top-1/2 transform left-1/2 -translate-x-1/2 bg-[#4d4d4d10] backdrop-blur-xl border border-borderdefault rounded-lg p-5 w-[400px] z-10">
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
        </>
    );
}
