import React, { useState, ChangeEvent, FormEvent } from "react";
import { validateInput } from "../../helpers/userValidation";
import { useRegisterPostMutation } from "../../store/slices/adminApiSlice";
import { useNavigate } from "react-router-dom";
import { notifyError, notifySuccess } from "../common/Toast";
import { CustomError } from "../../schema/error";
import { errMessage } from "../../constants/errorMessage";
import LoadingButton from "../common/Loading";

const Login: React.FC = () => {

  const [registerPost, { isLoading }] = useRegisterPostMutation();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
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
      });
      return;
    }

    try {
      const res = await registerPost({ email, password }).unwrap();
      if (res.success) {
        notifySuccess("you have logged in");
        navigate("/admin/home");
      }

    } catch (err) {
      const error = err as CustomError;
      console.error("Error submitting form:", error);
      if (error.status === 400) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          ["password"]: error.data.error,
        }));
      } else if (error.status === "FETCH_ERROR") {
        notifyError(errMessage);
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          ["password"]: error.data.error,
        }));
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
          LOGIN TO ADMINSTRATIVE
        </h2>
        <div>
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email:
          </label>
          <input
            type="text"
            id="email"
            name="email"
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
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
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
        <LoadingButton
          buttonText="submit"
          isLoading={isLoading}
          onClick={handleSubmit}
          color="bg-black"
          width="w-full"
          height="h-10"
        />
      </form>
    </div>
  );
};

export default Login;
