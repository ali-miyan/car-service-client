import { useEffect, useMemo, useState } from "react";
import { FaSpinner, FaTimes } from "react-icons/fa";
import { TbMessageDots } from "react-icons/tb";
import { IoMdClose } from "react-icons/io";
import "../../../styles/SideBarNotification.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getInitialToken } from "../../../helpers/getToken";
import {
  useBookingSocket,
  useChatSocket,
} from "../../../service/socketService";
import OrderNotification from "../../common/OrderMessage";
import { resetOrder } from "../../../context/OrderContext";
import { useGetApprovedCompanyQuery } from "../../../store/slices/companyApiSlice";
import ChatSection from "./ChatSection";

const NotificationModal = () => {

  const token = getInitialToken("userToken");

  const { data } = useGetApprovedCompanyQuery({});

  const currentPath = useMemo(() => location.pathname, [location.pathname]);

  const {
    userId,
    address,
    carModel,
    selectedPackage,
    serviceDate,
    serviceId,
    selectedPlace,
    generalServiceId,
    companyId,
  } = useSelector((state: any) => state.order);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasNotification, setHasNotification] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [activeSection, setActiveSection] = useState<"chat" | "notifications">("notifications");
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [unreadMessages, setUnreadMessages] = useState<{ [key: string]: any[] }>({});


  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const stored = localStorage.getItem("orderUpdateNotifications");
    if (stored) {
      setNotifications(JSON.parse(stored));
    }
    const storedMessages = localStorage.getItem("unreadMessages") || "";
    if (storedMessages) {
      setUnreadMessages(JSON.parse(storedMessages));
    }
  }, []);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const bookingSocket = useBookingSocket(token as string);

  useEffect(() => {
    if (bookingSocket) {
      bookingSocket.on("order_updated", (message: any) => {
        const newNotification = {
          message: `${message.message} Status info: ${message.status}`,
          timestamp: new Date().toISOString(),
        };
        setMessage(`${message.message} Status info: ${message.status}`);
        setNotifications((prevNotifications) => [
          newNotification,
          ...prevNotifications,
        ]);
        setHasNotification(true);
        setShowToast(true);
        localStorage.setItem(
          "orderUpdateNotifications",
          JSON.stringify([newNotification, ...notifications])
        );
      });
    }

    return () => {
      if (bookingSocket) {
        bookingSocket.off("order_updated");
        bookingSocket.off("chat_message");
      }
    };
  }, [bookingSocket, notifications]);

  useEffect(() => {
    const isPending =
      address &&
      carModel &&
      selectedPackage &&
      serviceDate &&
      serviceId &&
      selectedPlace &&
      generalServiceId &&
      companyId;
    setHasNotification(
      isPending &&
        ![
          `/set-spot/${serviceId}`,
          `/service-schedule/${serviceId}`,
          `/checkout/${serviceId}`,
        ].includes(currentPath)
    );
  }, [
    address,
    carModel,
    selectedPackage,
    serviceDate,
    serviceId,
    selectedPlace,
    generalServiceId,
    companyId,
    currentPath,
  ]);

  const handleCloseNotification = () => {
    setShowToast(false);
    setHasNotification(false);
    localStorage.removeItem("orderUpdateNotifications");
    setNotifications([]);
  };

  if (isOpen) {
    document.body.style.overflowY = "hidden";
  } else {
    document.body.style.overflowY = "auto";
  }

  const chatSocket = useChatSocket(token);

  useEffect(() => {
    if (chatSocket) {
      chatSocket.on("company_to_user", (messageData: any) => {
        const { companyId, content } = messageData;
        setHasNotification(true);
        setUnreadMessages((prevUnreadMessages) => {
          const updatedUnreadMessages = {
            ...prevUnreadMessages,
            [companyId]: [
              ...(prevUnreadMessages[companyId] || []),
              content,
            ],
          };
          localStorage.setItem(
            "unreadMessages",
            JSON.stringify(updatedUnreadMessages)
          );
          return updatedUnreadMessages;
        });
      });

      return () => {
        chatSocket.off("company_to_user");
      };
    }
  }, [chatSocket]);
  
  const getUnreadCount = (companyId: string) => {
    const messages = unreadMessages[companyId];
    return Array.isArray(messages) ? messages.length : 0;
  };

  return (
    <div className="relative z-50">
      {token && (
        <OrderNotification
          show={showToast}
          message={message}
          to="/profile?section=garage"
        />
      )}
      <button
        onClick={toggleModal}
        className="animate-bounce fixed bottom-7 right-4 w-16 h-16 flex items-center justify-center rounded-full bg-[#ab0000] shadow-lg hover:bg-red-900 focus:outline-none"
      >
        <TbMessageDots className="text-white text-2xl" />
        {hasNotification && token === userId && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-blue-300 rounded-full"></span>
        )}
      </button>

      <div
        className={`modal-overlay ${
          isOpen ? "modal-overlay-open overflow-y-hidden" : ""
        }`}
        onClick={toggleModal}
      >
        <div
          className={`modal-content ${isOpen ? "modal-content-open" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <button
              aria-label="close modal"
              className="focus:outline-none absolute right-4 top-3"
              onClick={toggleModal}
            >
              <FaTimes className="w-4 h-4 text-black" />
            </button>

            <button
              className={`px-4 font-bai-bold lowercase py-2 border-b-2 ${
                activeSection === "notifications"
                  ? "border-red-900 text-red-900"
                  : "border-transparent  text-gray-600"
              } w-full transition-colors duration-300`}
              onClick={() => setActiveSection("notifications")}
            >
              Notifications
            </button>
            <button
              className={`px-4 font-bai-bold lowercase py-2 border-b-2 ${
                activeSection === "chat"
                  ? "border-red-900 text-red-900"
                  : "border-transparent  text-gray-600"
              } w-full transition-colors duration-300`}
              onClick={() => setActiveSection("chat")}
            >
              Chat
            </button>
          </div>

          <div className="mt-8">
            {activeSection === "notifications" && (
              <>
                {notifications.length > 0 && (
                  <p className="bg-gray-300 border-l-4 border-red-900 text-black p-1 mb-2 text-xs lowercase rounded">
                    Order updates
                  </p>
                )}
                {notifications.length > 0 &&
                  notifications.map((notification, index) => (
                    <div
                      key={index}
                      className="p-3 mb-2 bg-red-50 rounded flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div className="pl-3">
                          <p className="text-sm text-red-900">
                            {notification.message}
                          </p>
                          <p className="text-xs text-black font-bold lowercase">
                            Notification received at
                            {new Date(
                              notification.timestamp
                            ).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <button
                        className="px-2 py-2 lowercase bg-black text-white text-xs"
                        onClick={() => {
                          handleCloseNotification();
                          navigate(`/profile?section=garage`);
                        }}
                      >
                        Show
                      </button>
                      <button
                        className="ml-2 px-2 py-2 lowercase bg-red-900 text-white"
                        onClick={() => {
                          setNotifications((prevNotifications) =>
                            prevNotifications.filter((_, i) => i !== index)
                          );
                          localStorage.setItem(
                            "orderUpdateNotifications",
                            JSON.stringify(
                              notifications.filter((_, i) => i !== index)
                            )
                          );
                        }}
                      >
                        <IoMdClose />
                      </button>
                    </div>
                  ))}
                {notifications.length === 0 && !hasNotification && (
                  <p className="text-center text-gray-500">No notifications</p>
                )}
              </>
            )}

            {activeSection === "chat" && (
              <div className="">
                {selectedCompany ? (
                  <ChatSection
                    selectedCompany={selectedCompany}
                    setSelectedCompany={setSelectedCompany}
                    token={token}
                  />
                ) : (
                  <div className="max-w-4xl mx-auto ">
                    <ul className="divide-y  divide-gray-200">
                      {data && data.length > 0 ? (
                        data.map((company:any) => (
                          <li
                            key={company._id}
                            className="flex items-center  p-4 hover:bg-gray-100 cursor-pointer transition duration-200 ease-in-out"
                            onClick={() => {
                              setSelectedCompany(company);
                              const updatedUnreadMessages = { ...unreadMessages };
                              delete updatedUnreadMessages[company._id];
                              setUnreadMessages(updatedUnreadMessages);
                              localStorage.setItem(
                                "unreadMessages",
                                JSON.stringify(updatedUnreadMessages)
                              );
                            }}
                          >
                            <div className="flex-shrink-0 mr-4">
                              <img
                                src={company.logo}
                                alt={`${company.companyName} logo`}
                                className="w-14 h-14 object-cover rounded-full"
                              />
                            </div>
                            
                            <div className="flex-grow">
                              <h3 className="text-lg font-medium text-gray-900">
                                {company.companyName}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                  {`Since ${company.year}`}
                              </p>
                            </div>
                            {getUnreadCount(company._id) > 0 && (
                                <span className="text-xs bg-red-900 text-white rounded-full px-2 py-1">
                                  {getUnreadCount(company._id)} unread
                                </span>
                              )}
                          </li>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 mt-4">
                          No companies available
                        </p>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {hasNotification &&
              activeSection === "notifications" &&
              userId === token && (
                <>
                  <p className="bg-gray-300 border-l-4 border-yellow-600 text-black p-1 mb-2 text-xs lowercase rounded">
                    Order pendings
                  </p>
                  <div className="p-3 bg-yellow-100 rounded flex items-center justify-between">
                    <div className="flex items-center">
                      <FaSpinner className="w-8 h-8 text-yellow-600 animate-spin" />
                      <div className="pl-3">
                        <p className="text-sm text-yellow-800">
                          Your order is pending. Please complete your order.
                        </p>
                        <p className="text-xs text-gray-500">
                          Pending action required
                        </p>
                      </div>
                    </div>
                    <button
                      className="px-2 text-xs py-2 lowercase bg-yellow-700 text-white"
                      onClick={() => {
                        navigate(`/checkout/${serviceId}`);
                      }}
                    >
                      Proceed
                    </button>
                    <button
                      className="ml-2 px-2 py-2 lowercase bg-red-900 text-white"
                      onClick={() => {
                        dispatch(resetOrder());
                      }}
                    >
                      <IoMdClose />
                    </button>
                  </div>
                </>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
