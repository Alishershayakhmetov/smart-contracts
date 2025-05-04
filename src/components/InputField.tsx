import { FC } from "react";

type Props = {
    type: string; // 'text', 'password', etc.
    placeholder: string;
    value: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputField: FC<Props> = ({ type, placeholder, value, onChange }) => {
    return (
        <input
            type={type}
            className="w-full text-base text-white border border-borderdefault rounded-lg p-3 bg-transparent outline-none placeholder:text-tertiary"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    );
};

export default InputField;
