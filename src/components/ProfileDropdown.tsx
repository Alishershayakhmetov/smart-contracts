import Button from "@/components/Button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, FC } from "react";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import ProfileIcon from "./icons/ProfileIcon";
import ButtonWithIcon from "./ButtonWithIcon";
import ProfileDetails from "./ProfileDetails";

type Props = {
    name: string;
    setOpenModal: (isOpen: boolean) => void;
};

const ProfileDropdown: FC<Props> = ({ name, setOpenModal }) => {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
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
        <>
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
                        <ul className="flex flex-col gap-2.5 items-center w-full p-3 text-center">
                            <li
                                className="cursor-pointer w-fit hover:text-green leading-none"
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
            </div>
        </>
    );
};

export default ProfileDropdown;
