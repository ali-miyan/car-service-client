import React, { useState } from "react";
import { validateInput } from "../../helpers/userValidation";
import { FormState } from "../../schema/component";
import { useAddServicePostMutation } from "../../store/slices/adminApiSlice";
import { notifyError, notifySuccess } from "../common/Toast";
import { Link, useNavigate } from "react-router-dom";
import LoadingButton from "../common/Loading";
import { CustomError } from "../../schema/error";
import { errMessage } from "../../constants/errorMessage";

const AddYourService: React.FC = () => {
  const [addServicePost, { isLoading }] = useAddServicePostMutation();
  const navigate = useNavigate();
  
  const [subServiceInput, setSubServiceInput] = useState<string>("");
  const [formData, setFormData] = useState<FormState>({
    serviceName: "",
    description: "",
    logo: null,
    subServices: [],
  });

  const [errors, setErrors] = useState({
    serviceName: "",
    description: "",
    logo: "",
    subServices: "",
    global: "",
  });

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
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        logo: file,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        logo: "",
      }));
    }
  };

  const handleAddSubService = () => {
    if (subServiceInput.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        subServices: "Please enter a sub-service",
      }));
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      subServices: [...prevData.subServices, subServiceInput.trim()],
    }));

    setSubServiceInput("");
    setErrors((prevErrors) => ({
      ...prevErrors,
      subServices: "",
    }));
  };

  const handleSubServiceInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSubServiceInput(e.target.value);
  };

  const handleSubmit = async () => {
    const serviceNameError = validateInput("serviceName", formData.serviceName);
    const descriptionError = validateInput("description", formData.description);
    // const logoError = formData.logo ? "" : "Please provide a logo";
    const subServicesError =
      formData.subServices.length < 2
        ? "Please add at least two sub-service"
        : "";

    setErrors({
      serviceName: serviceNameError,
      description: descriptionError,
      logo: "",
      subServices: subServicesError,
      global: "",
    });

    if (serviceNameError || descriptionError  || subServicesError) {
      return;
    }

    const data = new FormData();
    data.append("serviceName", formData.serviceName);
    data.append("description", formData.description);
    data.append("image", formData.logo as File);
    formData.subServices.forEach((subService) => {
      data.append("services", subService);
    });

    try {
      
      const res = await addServicePost(data).unwrap();

      if (res.success) {
        notifySuccess("Successfully added");
        navigate("/admin/services", { state: { refetch: true } });
      }
    } catch (err) {
      console.log(err);
      const error = err as CustomError;
      if (error.status === 400 || error.status === 401) {
        setErrors((prev) => ({
          ...prev,
          global: error.data?.message,
        }));
      } else {
        notifyError(errMessage);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 sm:px-9 pt-14">
      <div className="font-bai-regular text-sm lowercase w-full max-w-3xl">
        <h2 className="font-bai-bold uppercase text-center mb-8 text-xl">
          ADD GENERAL SERVICE
        </h2>
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-full">
            <div className="form-group mb-6">
              <label className="block mb-2">Service Name</label>
              <input
                onChange={handleInputChange}
                value={formData.serviceName}
                type="text"
                className="h-12 w-full font-bai-regular border border-gray-300 rounded px-4"
                placeholder="Type here"
                name="serviceName"
              />
              {errors.serviceName && (
                <p className="text-red-500 font-bai-regular lowercase text-xs mt-2">
                  {errors.serviceName}
                </p>
              )}
            </div>
            <div className="form-group mb-6">
              <label className="block mb-2">Description</label>
              <input
                type="text"
                onChange={handleInputChange}
                value={formData.description}
                name="description"
                className="h-12 w-full font-bai-regular border border-gray-300 rounded px-4"
                placeholder="Type here"
              />
              {errors.description && (
                <p className="text-red-500 font-bai-regular lowercase text-xs mt-2">
                  {errors.description}
                </p>
              )}
            </div>
          </div>
          <div className="w-full sm:mt-8">
            <div className="form-group h-36 logo-upload relative">
              <input
                type="file"
                name="logo"
                onChange={handleImage}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              />
              {formData.logo ? (
                <img
                  src={URL.createObjectURL(formData.logo)}
                  alt="Company Logo"
                  className="w-24 h-24 object-cover m-2"
                />
              ) : (
                <div className="border border-gray-300 rounded flex items-center justify-center h-full">
                  <span>ADD YOUR COMPANY LOGO</span>
                </div>
              )}
              {errors.logo && (
                <p className="text-red-500 font-bai-regular lowercase text-xs mt-2">
                  {errors.logo}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="form-group mt-8">
          <h3 className="font-bai-bold mb-4">Sub-Services</h3>
          <div className="border border-gray-300 rounded p-4">
            <div className="flex items-center mb-4">
              <input
                type="text"
                value={subServiceInput}
                onChange={handleSubServiceInputChange}
                className="h-10 flex-grow px-3 font-bai-regular border border-gray-300 rounded"
                placeholder="Enter sub-service"
              />
              <button
                onClick={handleAddSubService}
                className="bg-black text-white px-4 py-2 rounded-lg ml-2"
              >
                Add
              </button>
            </div>
            {errors.subServices && (
              <p className="text-red-500 font-bai-regular lowercase text-xs mb-2">
                {errors.subServices}
              </p>
            )}
            {formData.subServices.map((subService, index) => (
              <div key={index} className="mb-2 text-gray-700">
                {index + 1}. {subService}
              </div>
            ))}
          </div>
        </div>
        {errors.global && (
          <p className="text-red-500 text-center mt-5 font-bai-regular lowercase text-xs">
            {errors.global}
          </p>
        )}
        <div className="text-center mt-8 flex justify-center space-x-4">
          <Link to={"/admin/services"}>
            <button className="bg-black h-10 px-4 text-white rounded">
              Back
            </button>
          </Link>
          <LoadingButton
            buttonText="Submit"
            isLoading={isLoading}
            onClick={handleSubmit}
            width="w-full sm:w-40"
            height="h-10"
          />
        </div>
      </div>
    </div>
  );
};

export default AddYourService;
