import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "tailwindcss/tailwind.css";
import { getInitialToken } from "../../helpers/getToken";
import { useGetMonthlyRevenueQuery } from "../../store/slices/orderApiSlice";
import { FaSpinner } from "react-icons/fa";
import { months } from "../../schema/component";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const companyId = getInitialToken("companyToken");

  const { data: revenue = [], isLoading } = useGetMonthlyRevenueQuery(
    companyId as string
  );

  const revenueData = months?.map((_, i) => {
    const item = revenue?.monthlyRevenue?.find(
      ({ month }: { month: string }) => new Date(month).getMonth() === i
    );
    return item ? parseFloat(item.totalRevenue) : 0;
  });

  const data:any = {
    labels: months,
    datasets: [
      {
        label: "Monthly Revenue",
        data: revenueData,
        fill: false,
        borderColor: "#ab0000",
        tension: 0.1,
      },
    ],
  };

  const options:any = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: ({ raw }:any) => `Revenue: ₹${raw}`,
        },
      },
    },
  };

  return (
    <div className="flex flex-col w-full  bg-gray-200 p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bai-bold text-center font-semibold">
          Dashboard
        </h1>
      </header>
      <main className="flex flex-col w-full gap-6 lg:flex-row lg:gap-6">
        <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 ">Monthly Revenue</h2>
          <div className="h-80">
            {isLoading ? (
              <div className="flex items-center justify-center h-full ">
                <FaSpinner className="animate-spin" />
              </div>
            ) : (
              <Line data={data} options={options} />
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-6">
          {[
            { title: "Total Revenue", value: `₹${revenue?.totalRevenue}` },
            { title: "Total bookings", value: revenue?.bookingCount },
            {
              title: "most prefered service place",
              value: `At ${
                revenue?.mostBookedServicePlace?.servicePlace || ""
              } - ${revenue?.mostBookedServicePlace?.bookingCount || "-"}`,
            },
          ].map(({ title, value }) => (
            <div key={title} className="bg-white p-7 rounded-lg shadow-lg">
              <h3 className=" mb-4">{title}</h3>
              <p className="text-xl  font-bai-bold">
                {isLoading ? <FaSpinner className="animate-spin" /> : value}
              </p>
            </div>
          ))}
        </div>
      </main>

      <section className="mt-6 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-center font-semibold mb-4">
          RECENTLY BOOKED USERS
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Date",
                  "service location",
                  "total price",
                  "Status",
                  "users location",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
              {revenue && revenue?.getBookedUserDetails?.length > 0? (
            <tbody className="bg-white divide-y divide-gray-200">
                {revenue?.getBookedUserDetails?.map(
                  ({
                    id,
                    createdAt,
                    servicePlace,
                    totalPrice,
                    payment,
                    address,
                  }: any) => (
                    <tr key={id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Intl.DateTimeFormat("en-US", {
                          month: "long",
                          day: "2-digit",
                        }).format(new Date(createdAt))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {servicePlace}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ₹{totalPrice}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{payment}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {address.city || "not provided"}
                      </td>
                    </tr>
                  )
                )}
            </tbody>
              ) : (
                <p className="text-xs">no bookings....</p>
              )}
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
