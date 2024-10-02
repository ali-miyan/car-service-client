import React, { useState, ChangeEvent, FormEvent } from "react";
import { validateInput } from "../../../helpers/userValidation";
import { useNavigate, useParams } from "react-router-dom";
import { notifyError, notifySuccess } from "../../common/Toast";
import { CustomError } from "../../../schema/error";
import { errMessage } from "../../../constants/errorMessage";
import { useResetPasswordMutation} from "../../../store/slices/userApiSlice";

const ChangePassword: React.FC = () => {

  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const [ resetPassword] = useResetPasswordMutation();


  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    global: ""
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateInput(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));

    if (name === "password") {
      setPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const passwordError = validateInput("password", password);
    const confirmPasswordError = validateInput("confirmPassword", confirmPassword);

    if (passwordError || confirmPasswordError) {
      setErrors({
        password: passwordError,
        confirmPassword: confirmPasswordError,
        global: ""
      });
      return;
    }

    if (password !== confirmPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Passwords do not match",
        global: ""
      }));
      return;
    }

    try {
      const res = await resetPassword({password,token}).unwrap();
      if (res.success) {
        notifySuccess("Your password has been reset successfully");
        navigate("/");
      }
    } catch (err) {
      const error = err as CustomError;
      if (error.status === 400) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          global: error.data.error,
        }));
      } else {
        notifyError(errMessage);
      }
    }
  };

  return (
    <div className="flex items-center text-sm bg-gray-100 justify-center lowercase min-h-screen font-bai-medium">
      <form
        className="p-5 rounded-lg font-bai-regular w-full max-w-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl mb-5 font-bold uppercase text-center font-bai-bold text-black">
          Change Your Password
        </h2>
        <div className="mb-3">
          <label htmlFor="password" className="block text-gray-700">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="enter your password"
            value={password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded focus:outline-none`}
          />
          {errors.password && (
            <p className="text-red-500 font-bai-regular lowercase text-xs">
              {errors.password}
            </p>
          )}
        </div>
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-gray-700">
            confirm cassword:
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="confirm your password"
            value={confirmPassword}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded focus:outline-none`}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 font-bai-regular lowercase text-xs">
              {errors.confirmPassword}
            </p>
          )}
        </div>
        {errors.global && (
          <p className="text-red-500 font-bai-regular text-center mb-2 lowercase text-xs">
            {errors.global}
          </p>
        )}
        <button
          type="submit"
          className="bg-black hover:bg-black text-white font-bai-regular lowercase py-2 px-4 rounded w-full h-12"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
