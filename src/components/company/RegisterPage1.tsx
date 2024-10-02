import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../../context/RegisterContext";
import "../../styles/companyRegister.css";
import { validateInput } from "../../helpers/userValidation";

const Page1: React.FC = () => {

  const { formData, setFormData, errors, setErrors } = useForm();
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

  const handleImage = (e:React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFormData((prevData) => ({
        ...prevData,
        logoImg: file,
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        logoImg: "",
      }));
    }
  };
  

  const handleNext = () => {
    const newErrors = {
      ownerName: validateInput("ownerName", formData.ownerName),
      companyName: validateInput("companyName", formData.companyName),
      year: validateInput("year", formData.year),
      description: validateInput("description", formData.description),
      logoImg: formData.logoImg ? "" : "Please upload a company logo.",
    };

    setErrors(newErrors);

    const valid = Object.values(newErrors).every((error) => !error);

    if (valid) {
        navigate("/company/register-2");
    }
    
  };

  return (
    <div className="register-container pb-20">
      <div className="register-box mt-16 font-bai-regular text-sm lowercase">
        <h2 className="font-bai-bold uppercase">REGISTER YOUR BUSINESS</h2>
        <h6>
          PLEASE PROVIDE ALL REQUIRED DETAILS TO REGISTER YOUR BUSINESS WITH US
        </h6>
        <div className="w-8/12 mx-auto">
          <div className="progress-bar">
            <div className="progress-step active">1</div>
            <div className="progress-line"></div>
            <div className="progress-step">2</div>
            <div className="progress-line"></div>
            <div className="progress-step">3</div>
          </div>
        </div>
        <div className="form-grid text-start">
          <div className="form-group">
            <label>Company Owner Name</label>
            <input
              onChange={handleInputChange}
              value={formData.ownerName}
              type="text"
              className="h-12 font-bai-regular"
              placeholder="Type here"
              name="ownerName"
            />
            {errors.ownerName && (
              <p className="text-red-500 font-bai-regular lowercase text-xs">{errors.ownerName}</p>
            )}
          </div>
          <div className="form-group">
            <label>Company Name</label>
            <input
              type="text"
              onChange={handleInputChange}
              value={formData.companyName}
              name="companyName"
              className="h-12  font-bai-regular"
              placeholder="Type here"
            />
            {errors.companyName && (
              <p className="text-red-500 font-bai-regular lowercase text-xs">{errors.companyName}</p>
            )}
          </div>
          <div className="form-group">
            <label>Year Established</label>
            <input
              type="number"
              onChange={handleInputChange}
              value={formData.year}
              name="year"
              className="h-12 font-bai-regular"
              placeholder="Type here"
            />
            {errors.year && (
              <p className="text-red-500 font-bai-regular lowercase text-xs">{errors.year}</p>
            )}
          </div>
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              onChange={handleInputChange}
              value={formData.description}
              name="description"
              className="h-12 font-bai-regular"
              placeholder="Type here"
            />
            {errors.description && (
              <p className="text-red-500 font-bai-regular lowercase text-xs">{errors.description}</p>
            )}
          </div>

          <div className="form-group logo-upload">
            <input
              type="file"
              name="logoImg"
              onChange={handleImage}
              className="absolute opacity-0 cursor-pointer"
            />
            {!formData.logoImg ? (
              <>
                <span>ADD YOUR COMPANY LOGO</span>
              </>
            ) : (
              <img src={formData.logoImg && URL.createObjectURL(formData.logoImg)} alt="Company Logo"  className="w-48"/>
            )}
            {errors.logoImg && <p className="text-red-500 font-bai-regular lowercase text-xs">{errors.logoImg}</p>}
          </div>
        </div>

        <div className="form-submit">
          <button onClick={handleNext}>NEXT</button>
        </div>
      </div>
    </div>
  );
};

export default Page1;
