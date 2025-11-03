import React, { useState, ChangeEvent } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { RiLockPasswordFill } from "react-icons/ri";

interface PasswordInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; 
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  placeholder = "Password",
}) => {
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  const toggleShowPassword = () => {
    setIsShowPassword((prev) => !prev);
  };

  return (
    <div className="relative w-full">
      <RiLockPasswordFill className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />

      <input
        type={isShowPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white shadow-sm"
      />

      {isShowPassword ? (
        <FaRegEye
          className="text-gray-700 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          onClick={toggleShowPassword}
        />
      ) : (
        <FaRegEyeSlash
          className="text-gray-700 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          onClick={toggleShowPassword}
        />
      )}
    </div>
  );
};

export default PasswordInput;
