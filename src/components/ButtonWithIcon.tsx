import { FC } from "react";
type Props = {
    icon: any;
    title: string;
    fontSize?: string;
    onClick: () => void;
};

const ButtonWithIcon: FC<Props> = ({ icon, title, fontSize, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="p-3 text-textGray bg-green rounded-lg border-[#444444] border cursor-pointer flex justify-center items-center self-center gap-3.5"
        >
            <span style={{ fontSize: fontSize || "16px" }}>{title}</span>
            {icon}
        </button>
    );
};

export default ButtonWithIcon;
