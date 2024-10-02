import { ReactNode, useCallback, useState } from "react";
import { FaLongArrowAltLeft } from "react-icons/fa";
import {
  MdBook,
  MdConstruction,
  MdDashboard,
  MdLogout,
  MdSupervisedUserCircle,
} from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../common/ConfirmationModal";

const Sidebar = ({ children }: { children: ReactNode }) => {

  const [open, setOpen] = useState<boolean>(true);

  const isActive = (path: string) => location.pathname === path;

  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    document.cookie =
      "adminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/admin/login");
  }, [navigate]);

  return (
    <div className="flex font-bai-regular uppercase bg-white">
      <div
        className={`${
          open ? "w-72" : "w-20"
        } bg-gray-200 p-5 pt-8 relative duration-300 flex-shrink-0`}
      >
        <FaLongArrowAltLeft
          className={`absolute cursor-pointer text-1xl bg-white -right-3 top-9 w-7 h-5 border-2 border-dark-purple rounded-full ${
            !open && "rotate-180"
          }`}
          onClick={() => setOpen(!open)}
        />
        <div className="flex gap-x-4 items-center">
          <img
            src={
              "/assets/_f91ac4f4-f43a-4549-9339-b2d9e4be63d9-removebg-preview.png"
            }
            className={`cursor-pointer rounded-full w-10 duration-500 text-black text-3xl ${
              open && "rotate-[360deg]"
            }`}
          />
          <h1
            className={`text-black origin-left font-bai-medium text-md   duration-200 ${
              !open && "scale-0"
            }`}
          >
            TUNE-UP
          </h1>
        </div>
        <ul className="pt-7">
          <Link to={"/admin/home"}>
            <li
              className={`flex rounded-md p-2 cursor-pointer hover:bg-red-100 text-black
              ${
                isActive("/admin/home") ? "bg-red-100" : ""
              } text-sm items-center gap-x-4 mt-4`}
            >
              <MdDashboard className="text-3xl" />
              <span
                className={`${
                  !open && "hidden"
                } origin-left duration-200 font-bai-bold`}
              >
                Dashboard
              </span>
            </li>
          </Link>
          <Link to={"/admin/users"}>
            <li
              className={`flex rounded-md p-2 cursor-pointer hover:bg-red-100
              ${
                isActive("/admin/users") ? "bg-red-100" : ""
              } text-black text-sm items-center gap-x-4 mt-4`}
            >
              <MdSupervisedUserCircle className="text-3xl" />
              <span
                className={`${
                  !open && "hidden"
                } origin-left duration-200 font-bai-bold`}
              >
                Users
              </span>
            </li>
          </Link>
          <Link to={"/admin/services"}>
            <li
              className={`flex rounded-md p-2 cursor-pointer hover:bg-red-100
               ${
                 isActive("/admin/services") || isActive("/admin/add-service")
                   ? "bg-red-100"
                   : ""
               } text-black text-sm items-center gap-x-4 mt-4`}
            >
              <MdConstruction className="text-3xl" />
              <span
                className={`${
                  !open && "hidden"
                } origin-left duration-200 font-bai-bold`}
              >
                Services
              </span>
            </li>
          </Link>
          <Link to={"/admin/notification"}>
            <li
              className={`flex rounded-md p-2 cursor-pointer hover:bg-red-100
               ${
                 isActive("/admin/notification") ? "bg-red-100" : ""
               } text-black text-sm items-center gap-x-4 mt-4`}
            >
              <MdBook className="text-3xl" />
              <span
                className={`${
                  !open && "hidden"
                } origin-left duration-200 font-bai-bold`}
              >
                COMPANIES
              </span>
            </li>
          </Link>
          <DeleteConfirmationModal
            body="Are you sure you want to logout?"
            onConfirm={handleLogout}
          >
            <li
              className={`flex rounded-md p-2 cursor-pointer hover:bg-red-100
               ${
                 isActive("/admin/logout") ? "bg-red-100" : ""
               } text-black text-sm items-center gap-x-4 mt-4`}
            >
              <MdLogout className="text-3xl" />
              <span
                className={`${
                  !open && "hidden"
                } origin-left duration-200 font-bai-bold`}
              >
                Log-out
              </span>
            </li>
          </DeleteConfirmationModal>
        </ul>
      </div>
      <div className="flex-1 overflow-auto bg-white">{children}</div>
    </div>
  );
};

export default Sidebar;
