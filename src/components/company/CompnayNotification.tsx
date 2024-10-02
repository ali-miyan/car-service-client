import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { TbMessageDots } from "react-icons/tb";
import "../../styles/SideBarNotification.css";
import GeneralChat from "./GeneralChat";
import "../../styles/Animation.css";

const CompanyNotificationModal = ({ id, companyData }:any) => {

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative z-50">
      <button
        onClick={toggleModal}
        className="animate-bounce fixed bottom-7 right-7 w-16 h-16 flex items-center justify-center rounded-full bg-[#ab0000] shadow-lg hover:bg-red-900 focus:outline-none"
      >
        <TbMessageDots className="text-white text-2xl" />
      </button>

      <div
        className={`modal-overlay ${isOpen ? "modal-overlay-open" : ""}`}
        onClick={toggleModal}
      >
        <div
          className={`modal-content ${isOpen ? "modal-content-open" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-end">
            <p
              className={`px-4 py-3 border-2 font-bai-bold border-gray-500 text-center text-black w-full transition-colors duration-300`}
            >
              Chats
            </p>
            <button
              aria-label="close modal"
              className="focus:outline-none absolute top-5 right-5"
              onClick={toggleModal}
            >
              <FaTimes className="w-4 h-4 text-black" />
            </button>
          </div>
          <div className="flex items-center text-center mt-4 justify-between">
            <div
              className={`px-4 font-bai-regular lowercase py-2 border-b-2 ${"border-red-900 text-red-900"} w-full transition-colors duration-300`}
              onClick={() => {
                setSelectedUser(null);
              }}
            >
              customer messages
            </div>
          </div>
          <GeneralChat
            selectedUser={selectedUser}
            id={id}
            companyData={companyData}
            setSelectedUser={setSelectedUser}
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyNotificationModal;
