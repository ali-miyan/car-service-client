import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { notifyError, notifySuccess } from "../../common/Toast";
import { errMessage } from "../../../constants/errorMessage";
import { validateInput } from "../../../helpers/userValidation";
import { useEditUserMutation } from "../../../store/slices/userApiSlice";
import { GetInitialToken } from "../../../helpers/getToken";

interface EditProfileModalProps {
  onClose: () => void;
  currentUsername?: string;
  currentPhone?: string;
  refetch: () => void;
  currentImage: string;
  setNewProfileImg: any;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  onClose,
  currentUsername,
  currentPhone,
  refetch,
  currentImage,
  setNewProfileImg,
}) => {
  const token = GetInitialToken("userToken");

  const [editUser] = useEditUserMutation({});
  
  const [username, setUsername] = useState<string>(currentUsername || "");
  const [phone, setPhone] = useState<string>(currentPhone || "");
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState(currentImage || "");
  const [usernameError, setUsernameError] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");

  useEffect(() => {
    setUsername(currentUsername || "");
    setPhone(currentPhone || "");
    setPreviewImage(currentImage || "");
  }, [currentUsername, currentPhone, currentImage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    
    const phoneError = phone ? validateInput("phone", phone) : "";
    const nameError = validateInput("username", username);

    setUsernameError(nameError);
    setPhoneError(phoneError);

    if (phoneError || nameError) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("id", token as string);
      formData.append("username", username);
      formData.append("phone", phone === "" ? "" : phone);
      if (image) {
        formData.append("image", image);
      }

      const res = await editUser(formData).unwrap();
      if (res.success) {
        notifySuccess("Profile updated successfully");
        setNewProfileImg(previewImage);
        refetch();
      }
      onClose();
    } catch (error) {
      console.error("Failed to update profile", error);
      notifyError(errMessage);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-end items-center">
          <FiX className="cursor-pointer text-end" onClick={onClose} />
        </div>
        <h2 className="text-md font-bold text-center uppercase mb-2">
          Edit Profile
        </h2>
        <div className="mb-4 text-center">
          <img
            src={previewImage}
            alt="Current Profile"
            className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-700"
          />
        </div>
        <div className={`flex flex-col w-full`}>
          <label className="text-black mb-1 ml-0.5 uppercase font-bai-regular text-xs">
            Username
          </label>
          <input
            type="text"
            placeholder="username"
            name="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`bg-white text-gray-600 font-bai-regular p-2 border ${
              usernameError ? "border-red-500" : "border-gray-500"
            } rounded focus:outline-none`}
          />
          {usernameError && (
            <p className="text-red-500 text-xs">{usernameError}</p>
          )}
        </div>

        <div className={`flex flex-col w-full`}>
          <label className="text-black mb-1 ml-0.5 uppercase font-bai-regular text-xs">
            Phone
          </label>
          <input
            type="text"
            placeholder="phone"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`bg-white text-gray-600 font-bai-regular p-2 border ${
              phoneError ? "border-red-500" : "border-gray-500"
            } rounded focus:outline-none`}
          />
          {phoneError && <p className="text-red-500 text-xs">{phoneError}</p>}
        </div>
        <div className="flex justify-end gap-4 mt-3">
          <button
            className="px-4 py-1 bg-gray-900 text-white rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-1 bg-red-900 text-white rounded"
            onClick={handleUpdate}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
