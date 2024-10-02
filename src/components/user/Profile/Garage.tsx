import { useGetUsersOrderQuery } from "../../../store/slices/orderApiSlice";
import { getInitialToken } from "../../../helpers/getToken";
import { Link } from "react-router-dom";

const MyBookings = () => {

  const token = getInitialToken("userToken");
  const { data: orders, isLoading } = useGetUsersOrderQuery(token as string);

  if (isLoading) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Order List</h1>
        <div className="space-y-4">
          {[...Array(5)]?.map((_, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 border border-gray-300 rounded-lg bg-gray-100 animate-pulse"
            >
              <div className="w-12 h-4 bg-gray-200 rounded"></div>
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
              <div className="w-48 h-4 bg-gray-200 rounded"></div>
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4 text-center underline">
        order List
      </h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-300">
            <th className="py-2 px-4 text-left">No</th>
            <th className="py-2 px-4 text-left">service ID</th>
            <th className="py-2 px-4 text-left">service Place</th>
            <th className="py-2 px-4 text-left">service Date</th>
            <th className="py-2 px-4 text-left">status</th>
            <th className="py-2 px-4 text-left">View</th>
          </tr>
        </thead>
        <tbody>
          {orders &&
            orders
              .slice()
              .reverse()
              .map((order:any, index:number) => (
                <tr key={order?.id} className="border-b border-gray-200">
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">#{order?.id.substring(0, 8)}</td>
                  <td className="py-2 px-4">{order?.servicePlace}</td>
                  <td className="py-2 px-4">{order?.date}</td>
                  <td className="py-2 px-4">{order?.status}</td>
                  <td className="py-2 px-4">
                    <button className="text-red-900 hover:underline">
                      <Link to={`/order-details/${order.id}`}>View</Link>
                    </button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
      {orders?.length === 0 && (
        <p className="text-center mt-5">you don't have any services </p>
      )}
    </div>
  );
};

export default MyBookings;
