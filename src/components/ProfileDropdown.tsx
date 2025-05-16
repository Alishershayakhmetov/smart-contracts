import Button from "@/components/Button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, FC } from "react";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import ProfileIcon from "./icons/ProfileIcon";
import ButtonWithIcon from "./ButtonWithIcon";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Typography,
} from "@mui/material";

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

            {session?.user.isAdmin && (
              <li
                className="cursor-pointer hover:text-green"
                onClick={() => {
                  router.push("/admin");
                  setIsMenuOpen(false);
                }}
              >
                Admin panel
              </li>
            )}
          </ul>
        </div>
      )}

      {openModal &&
        ProfileModal({ open: openModal, onClose: handleCloseModal, session })}
    </div>
  );
};

export default ProfileDropdown;

type ProfileModalProps = {
  open: boolean;
  onClose: () => void;
  session: Session | null;
};

const ProfileModal = ({ open, onClose, session }: ProfileModalProps) => {
  console.log(session);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          textAlign: "center",
          color: "var(--color-green)",
          fontWeight: "bold",
          backgroundColor: "var(--background)",
          borderBottom: "1px solid #333",
          py: 2,
        }}
      >
        Profile details
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: "var(--background)", py: 3 }}>
        {session?.user && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              color: "#FFFFFF",
            }}
          >
            <Box>
              <Typography
                variant="subtitle1"
                color="var(--color-green)"
                fontWeight="bold"
              >
                Your name
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  mt: 1,
                  backgroundColor: "var(--background)",
                  borderColor: "#333",
                  color: "#FFFFFF",
                }}
              >
                <Typography>{session.user.name}</Typography>
              </Paper>
            </Box>
            <Box>
              <Typography
                variant="subtitle1"
                color="var(--color-green)"
                fontWeight="bold"
              >
                Your email
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  mt: 1,
                  backgroundColor: "var(--background)",
                  borderColor: "#333",
                  color: "#FFFFFF",
                }}
              >
                <Typography>{session.user.email}</Typography>
              </Paper>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          backgroundColor: "var(--background)",
          borderTop: "1px solid #333",
        }}
      >
        <Button title="Close" onClick={onClose} />
      </DialogActions>
    </Dialog>
  );
};
