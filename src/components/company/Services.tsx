import { notifyError, notifySuccess } from "../common/Toast";
import { errMessage } from "../../constants/errorMessage";
import { useState, useEffect } from "react";
import {
  useGetServicesQuery,
  useUpdateServiceStatusMutation,
  useDeleteServicePostMutation,
} from "../../store/slices/companyApiSlice";
import { profileImg } from "../../constants/imageUrl";
import CustomModal from "../common/Modal";
import ListPackages from "./ListPackages";
import DeleteConfirmationModal from "../common/ConfirmationModal";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { getInitialToken } from "../../helpers/getToken";
import { useLocation } from "react-router-dom";
import Pagination from "../common/Pagination";
import { useBookingSocket } from "../../service/socketService";

const ServiceList = () => {
  const companyId = getInitialToken("companyToken");

  const {data: posts,isLoading,refetch,} = useGetServicesQuery(companyId as string);
  const [deleteServicePost] = useDeleteServicePostMutation();
  const [updateStatus] = useUpdateServiceStatusMutation();

  const location = useLocation();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [toggleStates, setToggleStates] = useState<{ [key: string]: boolean }>({});
  const [showModal, setShowModal] = useState<boolean>(false);
  const [basic, setBasic] = useState([]);
  const [standard, setStandard] = useState([]);
  const [premium, setPremium] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (location.state.refetch) {
        refetch();
      }
    };

    fetchData();
  });

  const socket = useBookingSocket(companyId as string);

  useEffect(() => {
    if (socket) {
      socket.on("order_booked", (message: any) => {
        if (companyId === message.order.companyId) {
          refetch()
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("order_booked");
      }
    };
  }, [socket, posts]);


  const handleModal = (basic:any, standard:any, premium:any) => {
    setShowModal(true);
    setBasic(basic);
    setStandard(standard);
    setPremium(premium);
  };

  const itemsPerPage = 5;
  const currentPosts = posts?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteServicePost(id).unwrap();

      if (res.success) {
        notifySuccess("Deleted successfully");
        await refetch();
      } else {
        notifyError(errMessage);
      }
    } catch (error) {
      notifyError(errMessage);
      console.error("Failed to delete the service:", error);
    }
  };

  useEffect(() => {
    if (posts) {
      const initialToggleStates = posts.reduce((acc: any, post: any) => {
        acc[post._id] = post.isBlocked;
        return acc;
      }, {});
      setToggleStates(initialToggleStates);
    }
  }, [posts]);

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      const updatedStatus = !currentStatus;
      const res = await updateStatus({
        id,
        isBlocked: updatedStatus,
      }).unwrap();

      if (res.success) {
        setToggleStates((prevState) => ({ ...prevState, [id]: updatedStatus }));
        notifySuccess("Status updated successfully");
        refetch();
      } else {
        notifyError(errMessage);
      }
    } catch (error) {
      notifyError(errMessage);
      console.error("Failed to update the service status:", error);
    }
  };
  return (
    <>
      <div
        style={{ height: "100%", width: "100%" }}
        className="container lowercase bg-gray-200 font-bai-regular mx-auto p-9"
      >
        <div className="overflow-x-auto">
          <p className="text-center text-2xl font-bai-bold underline underline-offset-8 mb-3 pb-4 uppercase">
            SERVICES
          </p>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NO.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  work photos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  service place
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  working hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  packages
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr className="px-6 py-4 whitespace-nowrap">
                  <td colSpan={7} className="py-6">
                    <div className="animate-pulse">
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </td>
                </tr>
              ) : currentPosts && currentPosts.length > 0 ? (
                currentPosts.map((post: any, index: number) => (
                  <tr
                    className="px-6 py-4 whitespace-nowrap bg-white"
                    key={post._id}
                  >
                    <td className=" border-b text-center">
                      {(currentPage - 1) * itemsPerPage + index + 1}.
                    </td>
                    <td className="p-3 border-b justify-center flex">
                      {post.images ? (
                        <img
                          src={post.images[0]}
                          className="w-16 h-16 object-cover rounded-full"
                          alt="loading..."
                        />
                      ) : (
                        <img
                          src={profileImg}
                          className="w-16 h-16 object-cover rounded-full"
                          alt="loading..."
                        />
                      )}
                    </td>
                    <td className="p-3 border-b text-center">
                      {post.servicePlace}
                    </td>
                    <td className="p-3 w-1/6 border-b text-center">
                      {post.selectedHours}
                    </td>
                    <td className="p-3 text-center">
                      <p
                        className="cursor-pointer text-red-800 hover:underline"
                        onClick={() =>
                          handleModal(
                            post.basicPackage,
                            post.standardPackage,
                            post.premiumPackage
                          )
                        }
                      >
                        tap here
                      </p>
                    </td>
                    <td className="p-3 border-b text-center">
                      <span
                        className={`inline-block px-2 pt-2 pb-1 rounded ${
                          !toggleStates[post._id]
                            ? "bg-green-100 text-green-900"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            value=""
                            className="sr-only peer"
                            checked={!toggleStates[post._id]}
                            onChange={() =>
                              handleToggle(post._id, toggleStates[post._id])
                            }
                          />
                          <div className="relative w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-600"></div>
                          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                            {toggleStates[post._id] ? "off" : "on"}
                          </span>
                        </label>
                      </span>
                    </td>
                    <td className="p-3 border-b text-center">
                      <DeleteConfirmationModal
                        body="Are you sure you want to delete this item?"
                        onConfirm={() => {
                          handleDelete(post._id);
                        }}
                      >
                        <button className="bg-red-800 hover:bg-red-900 text-white p-3 rounded">
                          <AiFillDelete />
                        </button>
                      </DeleteConfirmationModal>
                      <Link to={`/company/edit-service/${post._id}`}>
                        <button>edit</button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="px-6 py-4 whitespace-nowrap">
                  <td colSpan={7} className="py-4 text-center">
                    <p>No services available.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination
            totalItems={posts?.length || 0}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
          <div className="flex justify-center mt-4">
            <Link to="/company/add-services">
              <button className="bg-black lowercase text-white px-4 py-2 my-2 rounded">
                ADD NEW SERVICE
              </button>
            </Link>
          </div>
        </div>
      </div>
      {showModal && (
        <CustomModal
          open={showModal}
          title={"packages"}
          width={500}
          height={500}
          onClose={() => setShowModal(false)}
          children={
            <>
              <ListPackages
                basic={basic}
                standard={standard}
                premium={premium}
              />
            </>
          }
        />
      )}
    </>
  );
};

export default ServiceList;
