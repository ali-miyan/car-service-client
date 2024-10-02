import React from "react";
import { Toaster, toast } from "react-hot-toast";
import "../../styles/Toast.css";

const notifySuccess = (message: string) =>
  toast.success(message, { className: "custom-toast-success" });

const notifyError = (message: string) =>
  toast.error(message, { className: "custom-toast-error" });

const Toast: React.FC = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,
        style: {
          border: "1px solid #713200",
          padding: "16px",
          color: "#713200",
        },
      }}
    />
  );
};

export { Toast, notifySuccess, notifyError };
