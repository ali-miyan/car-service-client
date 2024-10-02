import React, { useState } from "react";
import { ModalPopsCustom } from "../../../schema/component";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setServiceId,
  setServicePlace,
  setUserId,
} from "../../../context/OrderContext";

const TermsAndService: React.FC<ModalPopsCustom> = ({
  isOpen,
  onClose,
  data,
  servicePlace,
  id,
  userId,
}) => {
  const [agreed, setAgreed] = useState<boolean>(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
    const items = data
      ?.split("--")
      .map((item) => item.trim())
      .filter((item) => item);

  const handleProceed = () => {
    if (agreed) {
      dispatch(setServicePlace(servicePlace));
      dispatch(setServiceId(id));
      dispatch(setUserId(userId));
      navigate(`/set-spot/${id}`);
    } else {
      alert("You must agree to the terms and conditions before proceeding.");
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed font-bai-regular inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6  shadow-md w-full max-w-lg relative">
        <button
          type="button"
          onClick={onClose}
          className="text-gray-800 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-300 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="sr-only">Close modal</span>
        </button>
        <h1 className="text-md font-bold mb-4 text-center uppercase">
          Terms and Conditions
        </h1>
        <div className="space-y-4 mb-6">
          <ul className="list-disc lowercase mx-6 text-sm">
            {items?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="custom-checkbox"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
              className="sr-only"
            />
            <div
              onClick={() => setAgreed(!agreed)}
              className={`flex items-center justify-center w-5 h-5 border cursor-pointer ${
                agreed
                  ? "bg-red-900 border-red-900"
                  : "bg-white border-gray-700"
              }`}
            >
              {agreed && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <label
              htmlFor="custom-checkbox"
              className={`${agreed ? "text-black" : "text-gray-700"}`}
            >
              I agree to the terms and conditions
            </label>
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-red-900 text-white px-4 py-2  hover:bg-red-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleProceed}
            className={`bg-black text-white px-4 py-2 transition-colors ${
              !agreed && "bg-gray-800 hover:cursor-not-allowed "
            }`}
            disabled={!agreed}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndService;
