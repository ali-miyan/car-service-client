import React, { useState, ChangeEvent, FormEvent } from "react";
import { validateInput } from "../../helpers/userValidation";
import { useLoginPostMutation } from "../../store/slices/companyApiSlice";
import { Link, useNavigate } from "react-router-dom";
import { notifyError, notifySuccess } from "../common/Toast";
import { CustomError } from "../../schema/error";
import { errMessage } from "../../constants/errorMessage";

const Login: React.FC = () => {
  
  const navigate = useNavigate();
  
  const [loginPost, { isLoading }] = useLoginPostMutation();


  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    global:""
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
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailError = validateInput("email", email);
    const passwordError = validateInput("password", password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
        global:""
      });
      return;
    }

    try {
      const res = await loginPost({ email, password }).unwrap();
      console.log(res);

      if (res.success) {
        notifySuccess("you have logged in");
        navigate("/company/home");
      }
    } catch (err) {
        console.log("Form error:",err);
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
  };

  return (
    <div className="flex items-center bg-gray-100 justify-center lowercase min-h-screen font-bai-medium">
      <form
        className=" p-5 rounded-lg font-bai-regular w-full max-w-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl mb-5 font-bold uppercase text-center font-bai-bold text-black">
        LOGIN TO  YOUR BUSINESS
        </h2>
        <div>
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email:
          </label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="your email here"
            value={email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded focus:outline-none`}
          />
          {errors.email && (
            <p className="text-red-500 font-bai-regular lowercase text-xs">
              {errors.email}
            </p>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="your password here"
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
        {errors.global && (
            <p className="text-red-500 font-bai-regular text-center mb-2 lowercase text-xs">
              {errors.global}
            </p>
          )}
        {isLoading ? (
          <button className="bg-red-800 text-white font-bold py-2 px-4 rounded w-full h-12 flex items-center justify-center" disabled>
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
          <button className="bg-black hover:bg-black text-white font-bai-regular lowercase py-2 px-4 rounded w-full h-12">
            LOGIN
          </button>
        )}
        <div className="col-span-2 text-center mb-1">
        <button
          type="submit"
          className="text-red-800 text-sm mt-3 font-bai-regular"
        >
          <span className="text-black text-sm font-bai-regular">
            Don't have an account?
          </span>
          <Link to={'/company/register-1'}><span className="hover:underline">Register</span></Link>
        </button>
      </div>
      </form>
    </div>
  );
};

export default Login;
