"use client";
import { FC } from "react";

type Props = {
    onClick: () => void;
    title: string;
}

const Button: FC<Props> = ({onClick, title}) => {
    return (
        <button onClick={onClick} className="p-3 text-textGray bg-green rounded-lg border-borderdefault hover:bg-lime-900 hover:text-white border cursor-pointer">
            {title}
        </button>
    );
};

export default Button;
