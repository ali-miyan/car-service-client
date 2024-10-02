import { useEffect, useState } from "react";
import {
  useGetCompaniesQuery,
  useUpdateCompanyMutation,
} from "../../store/slices/companyApiSlice";
import { Link, useLocation } from "react-router-dom";
import { Post } from "../../schema/component";
import { notifyError, notifySuccess } from "../common/Toast";
import { errMessage } from "../../constants/errorMessage";
import Pagination from "../common/Pagination";

const Notification = () => {
  const location = useLocation();
  const { data: posts, isLoading, refetch } = useGetCompaniesQuery({});
  const [updateCompany] = useUpdateCompanyMutation({});

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

  useEffect(() => {
    if (location.state?.refetch) {
      refetch();
    }
  }, [location.state, refetch]);
  
  
  const itemsPerPage = 5;
  const currentPosts = posts?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      const updatedStatus = !currentStatus;
      const res = await updateCompany({ id, isBlocked: updatedStatus }).unwrap();
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

  return (
    <div style={{ height: "100%" }} className="container lowercase font-bai-regular bg-gray-50 mx-auto p-4">
      <p className="text-center text-2xl font-bai-bold underline underline-offset-8 mb-3 pb-4 uppercase">
          COMPANY DETAILS
        </p>
      <div className="overflow-x-auto min-h-screen">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 border border-gray-300">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NO.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LOGO</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COMPANY NAME</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OWNER</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ISACTIVE</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VIEW</th>
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
              currentPosts.map((post: Post, index: number) => (
                <tr className="bg-white border-gray-300 border" key={post._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                  {(currentPage - 1) * itemsPerPage + index + 1}.
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={post.logo}
                      className="w-20 h-16 object-cover"
                      alt="loading..."
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {post.companyName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {post.ownerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`${
                        post.isApproved === "accepted"
                          ? "bg-green-100 text-green-900"
                          : post.isApproved === "declined"
                          ? "bg-red-100 text-red-900"
                          : "bg-yellow-100 text-yellow-800"
                      } p-2 text-sm rounded`}
                    >
                      {post.isApproved}
                    </span>
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
                  <td className="px-6 py-4 whitespace-nowrap cursor-pointer hover:underline"><Link to={`/admin/detail-page/${post._id}`}>view</Link></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-4 text-center">
                  <p>No Notifcations.</p>
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
  );
};

export default Notification;
