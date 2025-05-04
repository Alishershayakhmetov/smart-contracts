import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FC } from "react";

type Props = {
    name: string;
};

const ProfileDropdown: FC<Props> = ({ name }) => {
    const router = useRouter();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
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
                <MenuItem onClick={handleClose}>Profile details</MenuItem>
                <MenuItem onClick={()=> {router.push('/user-certificates'), handleClose()}}>Certificates</MenuItem>
                <MenuItem onClick={handleClose}>Log out</MenuItem>
            </Menu>
        </div>
    );
};

export default ProfileDropdown;
