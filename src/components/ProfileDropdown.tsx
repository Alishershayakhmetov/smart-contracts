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
        <MenuItem onClick={handleProfileClick}>Profile details</MenuItem>
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
    width: 400,
    bgcolor: "background.paper",
    color: "black",
    boxShadow: 24,
    p: 4,
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
        <Typography id="profile-modal-title" variant="h6" component="h2" mb={2}>
          Profile Details
        </Typography>

        {session?.user && (
          <Box>
            <Typography>
              <strong>Name:</strong> {session.user.name}
            </Typography>
            <Typography>
              <strong>Email:</strong> {session.user.email}
            </Typography>
            {/* Add more fields as needed */}
            {session.user.image && (
              <Box mt={2}>
                <img
                  src={session.user.image}
                  alt="Profile"
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            )}
          </Box>
        )}

        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button variant="contained" onClick={handleCloseModal} sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
