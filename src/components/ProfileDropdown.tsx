import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FC } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

type Props = {
    name: string;
};

const ProfileDropdown: FC<Props> = ({ name }) => {
    const router = useRouter();
    const { data: session } = useSession();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openModal, setOpenModal] = useState(false);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleProfileClick = () => {
        setOpenModal(true);
        handleClose();
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
        <div>
            <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                className="p-3 text-textGray bg-green rounded-lg border-[#444444] border cursor-pointer"
            >
                {name}
            </Button>

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                }}
            >
                <MenuItem onClick={handleProfileClick}>
                    Profile details
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        router.push("/certificates");
                        handleClose();
                    }}
                >
                    Certificates
                </MenuItem>
                <MenuItem onClick={handleLogout}>Log out</MenuItem>
            </Menu>

            {modal(openModal, handleCloseModal, session)}
        </div>
    );
};

export default ProfileDropdown;

function modal(
    openModal: boolean,
    handleCloseModal: () => void,
    session: Session | null
) {
    // Modal style
    const modalStyle = {
        position: "absolute" as "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        gap: 100,
        width: 400,
        bgcolor: "background.paper",
        color: "black",
        boxShadow: 24,
        p: 5,
        borderRadius: 2,
    };

    return (
        <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="profile-modal-title"
            aria-describedby="profile-modal-description"
        >
            <Box sx={modalStyle}>
                <h2 className="text-2xl text-green font-bold">
                    Profile details
                </h2>
                {session?.user && (
                    <Box>
                        <div className="flex flex-col">
                            <span className="text-green font-bold text-base">
                                Your name
                            </span>
                            <span className="text-base border border-borderdefault rounded-lg p-3">
                                {session.user.name}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-green font-bold text-base">
                                Your email
                            </span>
                            <span className="text-base border border-borderdefault rounded-lg p-3">
                                {session.user.email}
                            </span>
                        </div>
                        {/* Add more fields as needed */}
                    </Box>
                )}

                <Box mt={3} display="flex" justifyContent="flex-end">
                    <Button
                        variant="contained"
                        onClick={handleCloseModal}
                        sx={{ mt: 2 }}
                        className="p-3 text-textGray bg-green rounded-lg border-[#444444] border cursor-pointer"
                    >
                        Close
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
