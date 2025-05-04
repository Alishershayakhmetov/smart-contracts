"use client";
import { FC } from "react";

type Props = {
    onClick: () => void;
    title: string;
}

const Button: FC<Props> = ({onClick, title}) => {
    return (
        <button onClick={onClick} className="p-3 text-textGray bg-green rounded-lg border-[#444444] border cursor-pointer">
            {title}
        </button>
    );
};

export default Button;
