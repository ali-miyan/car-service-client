import "../../../styles/NavbarStyle.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import BasicModal from "../Registeration/RegisterModal";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { LuUserCircle } from "react-icons/lu";
import { IoIosCloseCircleOutline } from "react-icons/io";
import ServiceMap from "./serviceMap";
import { getInitialToken } from "../../../helpers/getToken";
import { FaMapMarkedAlt } from "react-icons/fa";
import { useUserSocket } from "../../../service/socketService";
import NotificationModal from "./SideNotifacation";
import { ReactNotifications } from "react-notifications-component";
import { useGetUserByIdQuery } from "../../../store/slices/userApiSlice";

const UserNavbar = () => {

  const token = getInitialToken("userToken");

  const { data: posts } = useGetUserByIdQuery(token as string);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMap, setShowMap] = useState<boolean>(false);

  const socket = useUserSocket(token as string);
  const navigate = useNavigate();

  useEffect(() => {
    if (socket) {
      socket.on("user_blocked", (message: any) => {
        console.log("Message received: ", message);
        handleLogOut(message.userId);
      });
    }

    return () => {
      if (socket) {
        socket.off("user_blocked");
      }
    };
  }, [socket]);

  const location = useLocation();
  const currentPath = useMemo(() => location.pathname, [location.pathname]);

  useEffect(() => {
    if (location.state && location.state.openModal) {
      setIsModalOpen(true);
    }
  }, [location.state]);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMapClose = () => {
    setShowMap(false);
  };

  const handleMap = () => {
    setShowMap(true);
  };

  const handleLogOut = (userId: string) => {
    if (token === userId) {
      document.cookie =
        "userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      navigate("/");
    }
  };

  return (
    <>
      <ReactNotifications />
      {showMap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <button
            className="absolute top-14 z-50 right-3 text-black text-4xl"
            onClick={handleMapClose}
          >
            <IoIosCloseCircleOutline />
          </button>
          <ServiceMap />
        </div>
      )}
      <header className="w-full bg-[#ab0000]  font-bai-regular text-white">
        <div className="flex justify-between items-center py-2 px-4 mx-10 lg:mx-40">
          <div className="flex items-center space-x-2 md:space-x-4">
            <a
              href="https://www.facebook.com/profile.php?id=61564977654689"
              className="text-xl text-white"
            >
              <FaFacebook />
            </a>
            <a
              href="https://x.com/AliMiyan733397"
              className="text-xl text-white"
            >
              <FaTwitter />
            </a>
            <a
              href="https://www.linkedin.com/in/ali-miyan-a6b00328b/"
              className="text-xl text-white"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://www.instagram.com/alimiyn/"
              className="text-xl text-white"
            >
              <FaInstagram />
            </a>
          </div>
          <div className="hidden md:flex text-sm  items-center space-x-2 md:space-x-4">
            Call us now : (+84) 4567 421 978
          </div>
          <div className="block md:hidden">
            <button
              className="text-3xl text-gray-900"
              onClick={handleMenuToggle}
            >
              &#9776;
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between p-6 sm:px-16 bg-gray-900">
          <div
            onClick={handleMap}
            className="items-center cursor-pointer space-x-4"
          >
            <FaMapMarkedAlt className="text-2xl mx-auto mr-8" />
            <button className="mx-auto text-white text-xs">
              services near me
            </button>
          </div>
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className={`text-white font-bai-regular px-3 py-2 custom-underline ${
                currentPath === "/" || currentPath === "/home" ? "active" : ""
              }`}
            >
              HOME
            </Link>

            <Link
              to="/services"
              className={`text-white font-bai-regular px-3 py-2 custom-underline ${
                currentPath === "/services" ||
                currentPath.match(/^\/selected-service\/[a-f0-9]{24}$/)
                  ? "active"
                  : ""
              }`}
            >
              SERVICES
            </Link>

            <Link
              to="/for-business"
              className={`text-white font-bai-regular px-3 py-2 custom-underline ${
                currentPath === "/for-business" ? "active" : ""
              }`}
            >
              FOR BUSINESS
            </Link>

            <Link
              to="/about-us"
              className={`text-white font-bai-regular px-3 py-2 custom-underline ${
                currentPath === "/about-us" ? "active" : ""
              }`}
            >
              ABOUT US
            </Link>
          </nav>

          <div className="flex items-center text-white space-x-4">
            {token ? (
              <Link
                to={"/profile?section=car"}
                className="flex items-center space-x-2 text-xs"
              >
                <LuUserCircle className="text-gray-200" size={40} />
                <div>
                  <span>welcome</span>
                  <br />
                  <span className="text-gray-400 uppercase ">
                    {posts?.username}
                  </span>
                </div>
              </Link>
            ) : (
              <>
                <div
                  className="flex items-center space-x-2 text-xs cursor-pointer"
                  onClick={handleModalOpen}
                >
                  <LuUserCircle className="w-8 h-8 cursor-pointer" />
                  <div>
                    <span>welcome</span>
                    <br />
                    <span className="text-gray-400 lowercase ">
                      signup/login
                    </span>
                  </div>
                </div>
              </>
            )}

            {token && <NotificationModal />}
          </div>
        </div>

        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } md:hidden absolute top-13 z-100 left-0 w-full bg-white text-center`}
        >
          <Link
            to="/"
            className="block py-2 border text-black hover:bg-[#ab0000]"
            onClick={handleMenuToggle}
          >
            HOME
          </Link>
          <Link
            to="/services"
            className="block py-2 border text-black hover:bg-[#ab0000]"
            onClick={handleMenuToggle}
          >
            SERVICES
          </Link>
          <Link
            to="/for-business"
            className="block py-2 border text-black hover:bg-[#ab0000]"
            onClick={handleMenuToggle}
          >
            FOR BUSINESS
          </Link>
          <Link
            to="/about-us"
            className="block py-2 border text-black hover:bg-[#ab0000]"
            onClick={handleMenuToggle}
          >
            ABOUT US
          </Link>
          {token && (
            <Link
              to={"/profile?section=car"}
              className="block py-2 border text-black hover:bg-[#ab0000]"
              onClick={handleMenuToggle}
            >
              PROFILE
            </Link>
          )}
          {token && (
            <button
              className="block py-2 hover:bg-[#ab0000]"
              onClick={() => {
                handleLogOut(token);
                handleMenuToggle();
              }}
            >
              LOGOUT
            </button>
          )}
        </div>
      </header>

      {isModalOpen && (
        <BasicModal isOpen={isModalOpen} onClose={handleModalClose} />
      )}
    </>
  );
};

export default UserNavbar;
