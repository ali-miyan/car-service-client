import { Link, useLocation } from "react-router-dom";
import {
  useDeleteServicePostMutation,
  useGetServiceQuery,
  useUpdateServiceStatusMutation,
} from "../../store/slices/adminApiSlice";
import { Tooltip } from "@material-tailwind/react";
import { AiFillDelete } from "react-icons/ai";
import DeleteConfirmationModal from "../common/ConfirmationModal";
import { notifyError, notifySuccess } from "../common/Toast";
import { errMessage } from "../../constants/errorMessage";
import { useState, useEffect } from "react";
import Pagination from "../common/Pagination";
import { truncateDescription } from "../../helpers/trancuate";

const ServiceTable = () => {
  
  const location = useLocation();
  
  const { data: posts, isLoading, refetch } = useGetServiceQuery(undefined);
  const [deleteServicePost] = useDeleteServicePostMutation();
  const [updateServiceStatus] = useUpdateServiceStatusMutation();
  
  const [toggleStates, setToggleStates] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    if (location.state?.refetch) {
      refetch();
    }
  }, [location.state, refetch]);

  useEffect(() => {
    if (posts) {
      const initialToggleStates = posts.reduce((acc: any, post: any) => {
        acc[post._id] = post.isBlocked;
        return acc;
      }, {});
      setToggleStates(initialToggleStates);
    }
  }, [posts]);

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
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      const updatedStatus = !currentStatus;
      const res = await updateServiceStatus({
        id,
        isBlocked: updatedStatus,
      }).unwrap();
      if (res.success) {
        setToggleStates((prevState) => ({ ...prevState, [id]: updatedStatus }));
        notifySuccess("Status updated successfully");
        await refetch();
      } else {
        notifyError(errMessage);
      }
    } catch (error) {
      notifyError(errMessage);
    }
  };

  const itemsPerPage = 4;

  const currentPosts = posts?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div
        style={{ height: "100%" }}
        className="container lowercase font-bai-regular bg-gray-50 mx-auto p-4"
      >
        <p className="text-center text-2xl font-bai-bold underline underline-offset-8 mb-3 pb-4 uppercase">
          SERVICE details
        </p>
        <div className="overflow-x-auto min-h-screen">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 border border-gray-300">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NO.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IMAGE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SERVICE TYPE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DESCRIPTION
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NO OF PACKAGES
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STATUS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody className="border border-black">
              {isLoading ? (
                <tr className="">
                  <td colSpan={7} className="px-6 py-4 whitespace-nowrap">
                    <div className="animate-pulse">
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </td>
                </tr>
              ) : currentPosts && currentPosts.length > 0 ? (
                currentPosts.map((post: any, index: number) => (
                  <tr className="bg-white border-gray-300 border" key={post._id}>
                    <td className=" px-6 py-4 whitespace-nowrap">
                      {(currentPage - 1) * itemsPerPage + index + 1}.
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={post.logoUrl}
                        className="w-20 h-16 object-cover"
                        alt="loading..."
                      />
                    </td>
                    <td className=" px-6 py-4 whitespace-nowrap">
                      {post.serviceName}
                    </td>
                    <td className=" w-1/6 px-6 py-4 whitespace-nowrap">
                      {truncateDescription(post.description, 6)}
                    </td>
                    <td className=" px-6 py-4 whitespace-nowrap">
                      <Tooltip
                        content={post.subServices
                          ?.map(
                            (subService: { name: unknown }) => subService.name
                          )
                          .join(", ")}
                        className="bg-gray-800 font-bai-regular lowercase w-3/12"
                        placement="right-start"
                      >
                        <span className="p-3 bg-slate-50 cursor-pointer rounded">
                          {post.subServices?.length}
                        </span>
                      </Tooltip>
                    </td>
                    <td className=" px-6 py-4 whitespace-nowrap">
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
                    <td className=" px-6 py-4 whitespace-nowrap">
                      <DeleteConfirmationModal
                        body="Are you sure you want to delete this item?"
                        onConfirm={() => handleDelete(post._id)}
                      >
                        <button className="bg-red-800 hover:bg-red-900 text-white p-3 rounded">
                          <AiFillDelete />
                        </button>
                      </DeleteConfirmationModal>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
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
            <Link to="/admin/add-service">
              <button className="bg-black lowercase text-white px-4 py-2 my-2 rounded">
                ADD NEW SERVICE
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceTable;
