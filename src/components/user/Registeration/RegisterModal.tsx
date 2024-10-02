import React, { useState } from "react";
import CustomModal from "../../common/Modal";
import SignupForm from "./UserSignup";
import LoginForm from "./UserLogin";
import OtpForm from "./UserOtp";
import {
  useVerifyOtpMutation,
  useGoogleRegisterMutation,
} from "../../../store/slices/userApiSlice";
import { CustomError } from "../../../schema/error";
import { useGoogleLogin } from "@react-oauth/google";
import { notifyError, notifySuccess } from "../../common/Toast";
import { useNavigate } from "react-router-dom";

interface BasicModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BasicModal: React.FC<BasicModalProps> = ({ isOpen, onClose }) => {
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [allowClose, setAllowClose] = useState<boolean>(true);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [formData, setFromData] = useState<any>();
  const [otpError, setOtpError] = useState<string>("");

  const navigate = useNavigate();

  const getEmail = (formData: any) => {
    setFromData(formData);
  };

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [googleRegister, { isLoading: googleLoading }] =
    useGoogleRegisterMutation();

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleSubmitOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await verifyOtp({
        otp,
        email: formData.email,
        username: formData.username,
        password: formData.password,
      }).unwrap();
      if (res.success) {
        notifySuccess("registered successfully");
        console.log(res);
        navigate("/home");
      }
    } catch (err) {
      const error = err as CustomError;
      if (error.status === 400) {
        setOtpError(error.data.error);
      } else {
        notifyError("something went wrong,please try again later");
      }
    }
  };

  const handleGoogleButton = () => {
    handleGoogleSubmit();
  };

  const handleGoogleSubmit = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const res = await googleRegister(codeResponse).unwrap();
        console.log(res);
        if (res.success) {
          notifySuccess("Successfully logged");
          navigate("/home");
        } else {
          notifyError("Something went wrong");
        }
      } catch (err) {
        const error = err as CustomError;
        notifyError(error.data.error);
        console.log(error);
      }
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  const handleClose = () => {
    if (!isOtpSent || allowClose) {
      setAllowClose(true);
      onClose();
    }
  };

  return (
    <CustomModal
      open={isOpen}
      width={430}
      height={isOtpSent ? 320 : isLogin ? 440 : 480}
      buttonLabel={isOtpSent ? "Signup" : "Signup"}
      title={
        isOtpSent ? "Enter OTP" : isLogin ? "Login" : "Create your account"
      }
      onClose={handleClose}
      disableClose={isOtpSent}
    >
      <div className="flex flex-col items-center mt-10">
        {!isOtpSent && !isLogin && (
          <SignupForm
            onOtpRequest={() => setIsOtpSent(true)}
            getEmail={getEmail}
          />
        )}
        {!isOtpSent && isLogin && (
          <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
        )}
        {isOtpSent && (
          <>
            {otpError && (
              <p className="text-red-500 relative top-24 text-xs">{otpError}</p>
            )}
            <OtpForm
              otp={otp}
              isLoading={isLoading}
              onOtpChange={handleOtpChange}
              onSubmit={handleSubmitOtp}
              email={formData.email}
            />
          </>
        )}
        {!isOtpSent && !isLogin && (
          <div className="flex justify-center w-full mt-2 mb-2">
            <button onClick={() => setIsLogin(true)}>
              <span className="text-black text-sm font-bai-regular">
                Already a user?
              </span>
              <span className="hover:underline text-red-800 font-bai-regular">
                {" "}
                login
              </span>
            </button>
          </div>
        )}
        {!isOtpSent && (
          <>
            <div className="flex justify-center items-center mt-2">
              <span className="mr-2 font-bai-extra-light">OR</span>
            </div>
            <div className="flex justify-center w-full mt-2">
              <button
                onClick={handleGoogleButton}
                className={`flex items-center justify-center border px-5 py-3 rounded shadow-md bg-white text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200`}
                disabled={googleLoading}
              >
                <img
                  src="https://img.icons8.com/color/48/000000/google-logo.png"
                  alt="Google"
                  className="w-6 h-6 mr-3"
                />
                <span className="font-bai-semi-bold uppercase">
                  {googleLoading ? "....." : "Sign up with Google"}
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </CustomModal>
  );
};

export default BasicModal;
