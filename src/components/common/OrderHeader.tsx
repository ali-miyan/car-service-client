import React from "react";

export const RegistrationStep = React.memo(
  ({
    number,
    text,
    active = false,
    filled = false,
  }: {
    number: number;
    text: string;
    active?: boolean;
    filled?: boolean;
  }) => {
    return (
      <div className="flex flex-col items-center mb-4 md:mb-0">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-2
            ${
              active
                ? "bg-red-900 text-white"
                : filled
                ? "bg-red-100 text-red-900"
                : "bg-gray-300 text-gray-600"
            }
          `}
        >
          {number}
        </div>
        <p className="text-xs text-center font-semibold">{text}</p>
      </div>
    );
  }
);
