import { useGetOrdersQuery } from "../../store/slices/orderApiSlice";
import { Link } from "react-router-dom";
import { getInitialToken } from "../../helpers/getToken";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Pagination from "../common/Pagination";

const ListBooking = () => {

  const companyId = getInitialToken("companyToken");
  const location = useLocation();

  const {data: posts, isLoading, refetch} = useGetOrdersQuery(companyId as string);
  
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      if (location.state && location.state.refetch) {
        await refetch();
      }
    };

    fetchData();
  }, [location.state, refetch]);

  const itemsPerPage = 5;
  const currentPosts = posts?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  return (
    <>
      <div
        style={{ height: "100%", width: "100%" }}
        className="container lowercase bg-gray-200 font-bai-regular mx-auto p-9"
      >
        <p className="text-center text-2xl font-bai-bold underline underline-offset-8 mb-3 pb-4 uppercase">
          BOOKINGS
        </p>
        <div className="overflow-x-auto ">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NO.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  order id
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  scheduled at
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  service place
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  view
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr className="px-6 py-4 whitespace-nowrap">
                  <td colSpan={7} className="py-6">
                    <div className="animate-pulse space-y-2">
                      <div className="h-10 bg-gray-300 rounded  mx-20"></div>
                    </div>
                  </td>
                </tr>
              ) : currentPosts && currentPosts.length > 0 ? (
                currentPosts.reverse().map((post: any, index: number) => (
                  <tr
                    className="bg-white px-6 py-4 whitespace-nowrap"
                    key={post.id}
                  >
                    <td className=" px-6 py-4 whitespace-nowrap">
                      {(currentPage - 1) * itemsPerPage + index + 1}.
                    </td>
                    <td className="p-6 border-b justify-center flex">
                      #{post.id.substring(0, 6)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">{post.date}</td>

                    <td className="px-6 py-4 whitespace-nowrap ">
                      {post.servicePlace}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {post.payment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-green-100 p-2 rounded">
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap ">
                      <Link to={`/company/order-details/${post.id}`}>
                        <span className="hover:underline">view</span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-4 text-center">
                    <p>No ORDERS available.</p>
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

export default ListBooking;
