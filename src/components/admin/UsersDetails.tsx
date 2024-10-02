import { notifyError, notifySuccess } from "../common/Toast";
import { errMessage } from "../../constants/errorMessage";
import { useState, useEffect } from "react";
import {
  useGetUsersQuery,
  useUpdateStatusMutation,
} from "../../store/slices/userApiSlice";
import { FaRegUserCircle } from "react-icons/fa";
import Pagination from "../common/Pagination";

const UsersDetails = () => {

  const { data: posts, isLoading, refetch} = useGetUsersQuery({});
  const [updateUserStatus] = useUpdateStatusMutation();
  
  const [toggleStates, setToggleStates] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState<number>(1);

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
      const res = await updateUserStatus({
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
  const itemsPerPage = 5;

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
          USER details
        </p>
        <div className="overflow-x-auto min-h-screen">
          <table className="min-w-full divide-y divide-gray-200 ">
            <thead className="bg-gray-50 border border-gray-300">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NO.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PROFILE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NAME
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  EMAIL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PHONE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="border border-black">
              {isLoading ? (
                <tr>
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
                      {post.profileImg ? (
                        <img
                          src={post.profileImg}
                          className="w-16 h-16 object-cover rounded-full"
                          alt="loading..."
                        />
                      ) : (
                        <div className="p-2 text-center">
                          <FaRegUserCircle className="text-5xl" />
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {post.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {post.email}
                    </td>
                    <td
                      className={
                        post.phone
                          ? "px-6 py-4 whitespace-nowrap"
                          : "px-6 py-4 whitespace-nowrap"
                      }
                    >
                      {post.phone ? post.phone : "not added"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-4 text-center">
                    <p>No users available.</p>
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
        </div>
      </div>
    </>
  );
};

export default UsersDetails;
