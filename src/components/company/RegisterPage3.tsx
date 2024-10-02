import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "../../context/RegisterContext";
import "../../styles/companyRegister.css";
import { validateInput } from "../../helpers/userValidation";
import { useRegisterPostMutation } from "../../store/slices/companyApiSlice";
import { notifyError, notifySuccess } from "../common/Toast";
import { errMessage } from "../../constants/errorMessage";
import { CustomError } from "../../schema/error";
import LoadingButton from "../common/Loading";

const Page3: React.FC = () => {

  const { formData, setFormData, errors, setErrors } = useForm();

  const [registerPost, { isLoading }] = useRegisterPostMutation();

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    const error = validateInput(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (file.size > 1024 * 1024) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "File size exceeds limit (1MB).",
        }));
        setFormData((prevData) => ({
          ...prevData,
          [name]: undefined,
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [name]: file,
        }));
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "",
        }));
      }
    }
  };

  const handleSubmit = async () => {
    const newErrors = {
      licenseNumber: validateInput("licenseNumber", formData.licenseNumber),
      licenseExpiry: validateInput("licenseExpiry", formData.licenseExpiry),
      password: validateInput("password", formData.password),
      ownerName: validateInput("ownerName", formData.ownerName),
      companyName: validateInput("companyName", formData.companyName),
      year: validateInput("year", formData.year),
      description: validateInput("description", formData.description),
      contact1: validateInput("contact1", formData.contact1),
      contact2: validateInput("contact2", formData.contact2),
      email: validateInput("email", formData.email),
      logoImg: formData.logoImg ? "" : "Please upload a company logo.",
      address: formData.address ? "" : "Add your address please.",
      confirmPassword: validateInput(
        "confirmPassword",
        formData.confirmPassword
      ),
      licenseImg: formData.licenseImg ? "" : "Please upload a license image.",
      approvedImg: formData.approvedImg
        ? ""
        : "Please upload an approved image.",
    };

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    const valid = Object.values(newErrors).every((error) => !error);

    if (valid) {
      const formDatas = new FormData();

      console.log(formData);
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "logoImg") {
          formDatas.append("image", value as File);
        } else if (key === "licenseImg") {
          formDatas.append("image", value as File);
        } else if (key === "approvedImg") {
          formDatas.append("image", value as File);
        } else if (key === "address") {
          const jsonAddress = JSON.stringify(value);
          formDatas.append(key, jsonAddress);
        } else {
          formDatas.append(key, value);
        }
      });

      try {
        const res = await registerPost(formDatas).unwrap();

        if (res.success) {
          notifySuccess("registered succesfully");
          navigate('/company/login')
        }
      } catch (err) {
        const error = err as CustomError;
        if (error.status === 400) {
          notifyError(error.data.error);
        } else {
          notifyError(errMessage);
        }
      }
    } else {
      notifyError("Fill all required fields");
    }
  };

  return (
    <div className="register-container pb-5">
      <div className="register-box mt-16 font-bai-regular text-sm lowercase">
        <h2 className="uppercase font-bai-bold">
          REGISTER YOUR BUSINESS - Step 3
        </h2>
        <h6>
          PLEASE PROVIDE ALL REQUIRED DETAILS TO REGISTER YOUR BUSINESS WITH US
        </h6>
        <div className="w-8/12 mx-auto">
          <div className="progress-bar">
            <Link to={"/company/register-1"}>
              <div className="progress-step active">1</div>
            </Link>
            <div className="progress-line"></div>
            <Link to={"/company/register-2"}>
              <div className="progress-step active">2</div>
            </Link>
            <div className="progress-line"></div>
            <div className="progress-step active">3</div>
          </div>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>license Number</label>
            <input
              onChange={handleInputChange}
              value={formData.licenseNumber}
              type="number"
              className="h-12 font-bai-regular"
              placeholder="Type here"
              name="licenseNumber"
            />
            {errors.licenseNumber && (
              <p className="text-red-500 font-bai-regular lowercase text-xs">
                {errors.licenseNumber}
              </p>
            )}
          </div>
          <div className="form-group">
            <label>license Expiry Date</label>
            <input
              type="date"
              onChange={handleInputChange}
              value={formData.licenseExpiry}
              name="licenseExpiry"
              className="h-12  font-bai-regular"
            />
            {errors.licenseExpiry && (
              <p className="text-red-500 font-bai-regular lowercase text-xs">
                {errors.licenseExpiry}
              </p>
            )}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              onChange={handleInputChange}
              value={formData.password}
              name="password"
              className="h-12 font-bai-regular"
              placeholder="Type here"
            />
            {errors.password && (
              <p className="text-red-500 font-bai-regular lowercase text-xs">
                {errors.password}
              </p>
            )}
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              onChange={handleInputChange}
              value={formData.confirmPassword}
              name="confirmPassword"
              className="h-12 font-bai-regular"
              placeholder="Type here"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 font-bai-regular lowercase text-xs">
                {errors.confirmPassword}
              </p>
            )}
          </div>
          <div className="form-group logo-upload">
            <label>Upload license Image</label>
            <input
              type="file"
              onChange={(e) => handleImage(e)}
              name="licenseImg"
              className="absolute opacity-0 cursor-pointer"
            />
            {!formData.licenseImg ? (
              <span className="text-sm text-gray-600">
                Choose a file (Max 1MB)
              </span>
            ) : (
              <img
                src={URL.createObjectURL(formData.licenseImg)}
                alt="license Image"
                className="h-20 w-auto mt-2"
              />
            )}
            {errors.licenseImg && (
              <p className="text-red-500 font-bai-regular lowercase text-xs">
                {errors.licenseImg}
              </p>
            )}
          </div>
          <div className="form-group logo-upload">
            <label>Upload Government Approved Image</label>
            <input
              type="file"
              onChange={(e) => handleImage(e)}
              name="approvedImg"
              className="absolute opacity-0 cursor-pointer"
            />
            {!formData.approvedImg ? (
              <span className="text-sm text-gray-600">
                Choose a file (Max 1MB)
              </span>
            ) : (
              <img
                src={URL.createObjectURL(formData.approvedImg)}
                alt="Approved Image"
                className="h-20 w-auto mt-2"
              />
            )}
            {errors.approvedImg && (
              <p className="text-red-500 font-bai-regular lowercase text-xs">
                {errors.approvedImg}
              </p>
            )}
          </div>
        </div>

        <div className="form-submit">
          <button
            className="mr-3"
            onClick={() => navigate("/company/register-2")}
          >
            Back
          </button>
          <LoadingButton
            buttonText="Submit"
            isLoading={isLoading}
            onClick={handleSubmit}
            width="w-3/12"
            height="h-11"
          />
        </div>
      </div>
    </div>
  );
};

export default Page3;
