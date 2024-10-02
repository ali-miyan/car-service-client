import React, { useState, ChangeEvent, FormEvent } from "react";
import { validateInput } from "../../../helpers/userValidation";
import { useNavigate } from "react-router-dom";
import { notifyError, notifySuccess } from "../../common/Toast";
import { CustomError } from "../../../schema/error";
import { errMessage } from "../../../constants/errorMessage";
import { useResetRequestMutation } from "../../../store/slices/userApiSlice";

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();

  const [resetRequest, { isLoading }] = useResetRequestMutation();

  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState({
    email: "",
    global: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateInput(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));

    if (name === "email") {
      setEmail(value);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const passwordError = validateInput("email", email);

    if (passwordError) {
      setErrors({
        email: passwordError,
        global: "",
      });
      return;
    }

    try {
      const res = await resetRequest({ email }).unwrap();
      if (res.success) {
        notifySuccess(`an reset link has been sent to ${email} `);
        navigate("/");
      }
    } catch (err) {
      console.log(err);

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
    <div className="flex items-center bg-gray-100 justify-center lowercase min-h-screen font-bai-medium">
      <form
        className="p-5 rounded-lg font-bai-regular w-full max-w-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl mb-5 font-bold uppercase text-center font-bai-bold text-black">
          YOUR EMAIL
        </h2>
        <div className="mb-7">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="enter your email"
            value={email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded focus:outline-none`}
          />
          {errors.email && (
            <p className="text-red-800 font-bai-regular lowercase text-xs">
              {errors.email}
            </p>
          )}
          {errors.global && (
            <p className="text-red-500 font-bai-regular text-center lowercase text-sm">
              {errors.global}
            </p>
          )}
        </div>
        {isLoading ? (
          <button
            className="bg-black text-white font-bold py-2 px-4 rounded w-full h-12 flex items-center justify-center"
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
          <button className="bg-black text-white font-bai-regular font-sm py-2 px-4 rounded w-full h-12">
            sent reqeust
          </button>
        )}
      </form>
    </div>
  );
};

export default ChangePassword;
