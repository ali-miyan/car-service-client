import React, { useState, useEffect } from "react";
import "../../../styles/ButtonStyle.css";
import { useResendOtpMutation } from "../../../store/slices/userApiSlice";

interface OtpFormProps {
  otp: string;
  onOtpChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  email: string;
}

const OtpForm: React.FC<OtpFormProps> = ({
  otp,
  onOtpChange,
  onSubmit,
  isLoading,
  email,
}) => {
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  const [resendError, setResendError] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timer]);

  const handleResendOtp = async () => {
    if (!canResend) return;
    try {
      setResendError(null);
      const res = await resendOtp({ email }).unwrap();
      console.log(res);
      setTimer(60);
      setCanResend(false);
    } catch (error) {
      setResendError("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <>
      <div className="text-center relative bottom-6 text-sm text-gray-700">
        An OTP has been sent to {email}
      </div>
      <form className="grid grid-cols-1 gap-6 w-full" onSubmit={onSubmit}>
        <div>
          <div className={`flex flex-col w-full`}>
            <label className="text-black mb-1 ml-0.5 uppercase font-bai-regular text-xs">
              Otp
            </label>
            <input
              type="number"
              placeholder="otp"
              name="otp"
              value={otp}
              onChange={onOtpChange}
              className={`bg-white text-gray-600 font-bai-regular p-2 border ${"border-gray-500"} rounded focus:outline-none`}
            />
          </div>
        </div>
        <div className="col-span-2 flex items-center justify-center text-center">
          {isLoading ? (
            <button
              className="bg-red-800 text-white font-bold py-2 px-4 rounded w-full h-12 flex items-center justify-center"
              disabled
            >
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V2.5"
                ></path>
              </svg>
            </button>
          ) : (
            <button className="bg-red-800 hover:bg-red-900 text-white font-bold py-2 px-4 rounded w-full h-12">
              REGISTER
            </button>
          )}
        </div>
      </form>
      <div className="mt-4 text-center">
        <div className="flex justify-center w-full">
          <button
            onClick={handleResendOtp}
            className="flex items-center space-x-2 -space-y-0.5"
            disabled={!canResend}
          >
            <span className="text-black text-sm font-bai-regular">
              didn't get email?
            </span>
            <span
              className={`text-sm ${
                canResend
                  ? "hover:underline cursor-pointer text-red-800"
                  : "cursor-not-allowed text-gray-600"
              }  font-bai-regular`}
            >
              {isResending ? (
                <div className="spinner"></div>
              ) : (
                `resent ${canResend ? "" : `in (${timer}s)`}`
              )}
            </span>
          </button>
        </div>
        {resendError && <div className="text-red-500 mt-2">{resendError}</div>}
      </div>
    </>
  );
};

export default OtpForm;
