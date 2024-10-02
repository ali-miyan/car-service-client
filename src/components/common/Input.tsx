import React from "react";
import { InputProps } from "../../schema/component";

const Input: React.FC<InputProps & { error?: boolean }> = ({
  placeholder,
  width,
  label,
  type,
  name,
  value,
  onChange,
  error,
}) => {
  return (
    <div className={`flex flex-col ${width}`}>
      <label className="text-black mb-1 ml-0.5 uppercase font-bai-regular text-xs">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        className={`bg-white text-gray-600 font-bai-regular p-2 border ${
          error ? "border-red-500" : "border-gray-500"
        } rounded focus:outline-none `}
      />
    </div>
  );
};

export default Input;
