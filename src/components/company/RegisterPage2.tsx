import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "../../context/RegisterContext";
import "../../styles/companyRegister.css";
import { validateInput } from "../../helpers/userValidation";
import { FaMapMarkerAlt } from "react-icons/fa";
import CustomModal from "../common/Modal";
import LocationModal from "./LocationModal";

const Page2: React.FC = () => {

  const { formData, setFormData, errors, setErrors } = useForm();
  const navigate = useNavigate();


  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isAddressFilled, setIsAddressFilled] = useState<boolean>(false);
  
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

  const handleNext = () => {
    const newErrors = {
      contact1: validateInput("contact1", formData.contact1),
      contact2: validateInput("contact2", formData.contact2),
      email: validateInput("email", formData.email),
      location: isAddressFilled ? "" : 'please give a location',
    };

    setErrors(newErrors);

    const valid = Object.values(newErrors).every((error) => !error);

    if (valid) {
      navigate("/company/register-3");
    }
  };

  return (
    <div className="register-container pb-6">
      <div className="register-box font-bai-regular text-sm lowercase">
        <h2 className="font-bai-bold uppercase">REGISTER YOUR BUSINESS</h2>
        <h6>
          PLEASE PROVIDE ALL REQUIRED DETAILS TO REGISTER YOUR BUSINESS WITH US
        </h6>
        <div className="w-8/12 mx-auto">
          <div className="progress-bar">
            <Link to={"/company/register-1"}>
              <div className="progress-step active">1</div>
            </Link>
            <div className="progress-line"></div>
            <div className="progress-step active">2</div>
            <div className="progress-line"></div>
            <div className="progress-step">3</div>
          </div>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>Contact Number 1</label>
            <input
              onChange={handleInputChange}
              value={formData.contact1}
              type="number"
              className="h-12 font-bai-regular"
              placeholder="Type here"
              name="contact1"
            />
            {errors.contact1 && (
              <p className="text-red-500 font-bai-regular lowercase text-xs">
                {errors.contact1}
              </p>
            )}
          </div>
          <div className="form-group">
            <label>Contact Number 2</label>
            <input
              type="number"
              onChange={handleInputChange}
              value={formData.contact2}
              name="contact2"
              className="h-12 font-bai-regular"
              placeholder="Type here"
            />
            {errors.contact2 && (
              <p className="text-red-500 font-bai-regular lowercase text-xs">
                {errors.contact2}
              </p>
            )}
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              onChange={handleInputChange}
              value={formData.email}
              name="email"
              className="h-12 font-bai-regular"
              placeholder="Type here"
            />
            {errors.email && (
              <p className="text-red-500 font-bai-regular lowercase text-xs">
                {errors.email}
              </p>
            )}
          </div>
          <div className="form-group">
            <label className="block text-gray-700 font-bai-regular mb-2">
              YOUR LOCATION
            </label>
            <button
              type="button"
              className="flex items-center justify-between h-12 w-full px-4 bg-white border border-gray-300 rounded shadow-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-red-100"
              onClick={() => setOpenModal(true)}
            >
              <span className="font-bai-regular">
              {Object.keys((formData.address)).length === 0
                ? "Pick a location"
                : `${((formData.address?.streetRegion) || "")}, ${((formData.address?.city) || "")}, ${
                  ((formData.address?.postcode) || "")
                }`}
            </span>
              <FaMapMarkerAlt className="text-gray-500" />
            </button>
            {errors.location && (
              <p className="text-red-500 font-bai-regular lowercase text-xs mt-1">
                {errors.location}
              </p>
            )}
          </div>
        </div>

        <div className="form-submit">
          <button
            className="mr-4"
            onClick={() => navigate("/company/register-1")}
          >
            BACK
          </button>
          <button onClick={handleNext}>NEXT</button>
        </div>

        <CustomModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          width={500}
          height={560}
          disableClose={false}
          title={"CHOOSE YOUR LOCATION"}
        >
          <LocationModal onClose={() => setOpenModal(false)} setIsAddressFilled= {()=>setIsAddressFilled(true)}/>
        </CustomModal>
      </div>
    </div>
  );
};


export default Page2;
