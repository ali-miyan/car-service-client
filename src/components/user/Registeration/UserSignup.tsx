import React, { useState } from "react";
import {
  hasFormErrors,
  isFormEmpty,
  validateInput,
} from "../../../helpers/userValidation";
import { useRegisterPostMutation } from "../../../store/slices/userApiSlice";
import { CustomError } from "../../../schema/error";
import { notifyError } from "../../common/Toast";
import { errMessage } from "../../../constants/errorMessage";

interface SignupFormProps {
  onOtpRequest: () => void;
  getEmail: (email: any) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onOtpRequest, getEmail }) => {
  const [registerPost, { isLoading }] = useRegisterPostMutation();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    confirmPassword: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    confirmPassword: "",
    password: "",
    global: "",
  });

  const [errorFields, setErrorFields] = useState<Record<string, boolean>>({
    username: false,
    email: false,
    confirmPassword: false,
    password: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrorFields((prevErrorFields) => ({
      ...prevErrorFields,
      [name]: true,
    }));
    const error = validateInput(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
    if (error === "") {
      setErrorFields((prevErrorFields) => ({
        ...prevErrorFields,
        [name]: false,
      }));
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    getEmail(formData);

    const newErrors = {
      username: validateInput("username", formData.username),
      email: validateInput("email", formData.email),
      password: validateInput("password", formData.password),
      global: "",
      confirmPassword:
        formData.confirmPassword !== formData.password
          ? "password not matching"
          : "",
    };

    setErrors(newErrors);

    const hasError = hasFormErrors(newErrors);
    const isEmpty = isFormEmpty(formData);

    if (!hasError && !isEmpty) {
      try {
        const res = await registerPost({ email: formData.email }).unwrap();
        console.log(res);

        if (res.success) {
          onOtpRequest();
        }
      } catch (err) {
        const error = err as CustomError;
        console.log("Error occurred:", error);
        if (error.status === 400) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            global: error.data.error,
          }));
        } else {
          notifyError(errMessage);
        }
      }
    } else {
      setErrorFields({
        username: newErrors.username !== "",
        email: newErrors.email !== "",
        confirmPassword: newErrors.confirmPassword !== "",
        password: newErrors.password !== "",
      });
    }
  };

  return (
    <form
      className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full"
      onSubmit={handleSubmit}
    >
      <div>
        <div className={`flex flex-col w-full`}>
          <label className="text-black mb-1 ml-0.5 uppercase font-bai-regular text-xs">
            username
          </label>
          <input
            type="username"
            placeholder="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className={`bg-white text-gray-600 font-bai-regular p-2 border ${
              errorFields.username ? "border-red-500" : "border-gray-500"
            } rounded focus:outline-none`}
          />
        </div>
        {errors.username && (
          <p className="text-red-500 font-bai-regular lowercase text-xs">
            {errors.username}
          </p>
        )}
      </div>
      <div>
        <div className={`flex flex-col w-full`}>
          <label className="text-black mb-1 ml-0.5 uppercase font-bai-regular text-xs">
            Email
          </label>
          <input
            type="email"
            placeholder="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`bg-white text-gray-600 font-bai-regular p-2 border ${
              errorFields.email ? "border-red-500" : "border-gray-500"
            } rounded focus:outline-none`}
          />
        </div>
        {errors.email && (
          <p className="text-red-500 font-bai-regular lowercase text-xs">
            {errors.email}
          </p>
        )}
      </div>
      <div>
        <div className={`flex flex-col w-full`}>
          <label className="text-black mb-1 ml-0.5 uppercase font-bai-regular text-xs">
            Password
          </label>
          <input
            type={"password"}
            placeholder="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`bg-white text-gray-600 font-bai-regular p-2 border ${
              errorFields.password ? "border-red-500" : "border-gray-500"
            } rounded focus:outline-none`}
          />
        </div>

        {errors.password && (
          <p className="text-red-500 font-bai-regular lowercase text-xs">
            {errors.password}
          </p>
        )}
      </div>
      <div>
        <div className={`flex flex-col w-full`}>
          <label className="text-black mb-1 ml-0.5 uppercase font-bai-regular text-xs">
            Password
          </label>
          <input
            type={"password"}
            placeholder="confirm"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`bg-white text-gray-600 font-bai-regular p-2 border ${
              errorFields.confirmPassword ? "border-red-500" : "border-gray-500"
            } rounded focus:outline-none`}
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 font-bai-regular lowercase text-xs">
            {errors.confirmPassword}
          </p>
        )}
      </div>
      {errors.global && (
        <div className="text-center relative left-28">
          <p className="text-red-500 text-center text-xs">{errors.global}</p>
        </div>
      )}
      <div className="col-span-2 flex items-center justify-center text-center">
        {isLoading ? (
          <button
            className="bg-red-800  text-white font-bold py-2 px-4 rounded w-full h-12 flex items-center justify-center"
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
          <button className="bg-red-800 hover:bg-red-900 text-white font-bai-regular font-bold py-2 px-4 rounded w-full h-12">
            REGISTER
          </button>
        )}
      </div>
    </form>
  );
};

export default SignupForm;
