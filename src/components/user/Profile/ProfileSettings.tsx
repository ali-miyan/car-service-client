import React, { useState } from "react";
import { validateInput } from "../../../helpers/userValidation";
import { notifyError, notifySuccess } from "../../common/Toast";
import { errMessage } from "../../../constants/errorMessage";
import { useChangePasswordMutation } from "../../../store/slices/userApiSlice";
import { getInitialToken } from "../../../helpers/getToken";
import { CustomError } from "../../../schema/error";

const ProfileSettings: React.FC = () => {

  const userId = getInitialToken("userToken");
  const [changePassword] = useChangePasswordMutation();

  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentPasswordError = validateInput("password", currentPassword);
    const newPasswordError = validateInput("newPassword", newPassword);
    const confirmNewPasswordError = validateInput(
      "confirmPassword",
      confirmNewPassword
    );

    setErrors({
      currentPassword: currentPasswordError,
      newPassword: newPasswordError,
      confirmNewPassword: confirmNewPasswordError,
    });

    if (newPassword !== confirmNewPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmNewPassword: "Passwords do not match",
      }));
      return;
    }

    if (
      !currentPasswordError &&
      !newPasswordError &&
      !confirmNewPasswordError
    ) {
      try {
        await changePassword({
          userId,
          currentPassword,
          newPassword,
          confirmNewPassword,
        }).unwrap();
        notifySuccess("password changed");
        setConfirmNewPassword("");
        setCurrentPassword("");
        setNewPassword("");
      } catch (err) {
        const error = err as CustomError;
        console.log("Error occurred:", error);
        if (error.status === 400) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            confirmNewPassword: error.data.error,
          }));
        } else {
          notifyError(errMessage);
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center h-full bg-gray-100 p-6 md:p-12">
      <h1 className="text-2xl font-bold uppercase mb-3">Change Password</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow-md rounded w-full max-w-md"
      >
        <div className="mb-1">
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Current Password
          </label>
          <input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className=" p-2 border border-gray-300 rounded w-full"
          />
          {errors.currentPassword && (
            <p className="text-red-900 text-xs ">{errors.currentPassword}</p>
          )}
        </div>
        <div className="mb-1">
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className=" p-2 border border-gray-300 rounded w-full"
          />
          {errors.newPassword && (
            <p className="text-red-900 text-xs">{errors.newPassword}</p>
          )}
        </div>
        <div className="mb-3">
          <label
            htmlFor="confirmNewPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm New Password
          </label>
          <input
            id="confirmNewPassword"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className=" p-2 border border-gray-300 rounded w-full"
          />
          {errors.confirmNewPassword && (
            <p className="text-red-900 text-xs ">{errors.confirmNewPassword}</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-gray-900 text-white py-2 px-4 rounded w-full hover:bg-gray-800 transition-colors"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;
