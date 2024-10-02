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
import { useGetDashboardQuery } from "../../store/slices/companyApiSlice";
import { months } from "../../schema/component";
import { useGetUserDashboardQuery } from "../../store/slices/userApiSlice";
import { FaBuilding, FaCog, FaUser } from "react-icons/fa";
import Loader from "../common/Loader";

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
  const { data: dashboard, isLoading } = useGetDashboardQuery({});
  const { data: users, isLoading: userLoad } = useGetUserDashboardQuery({});

  if (isLoading || userLoad) {
    <Loader />;
  }

  const countsCompanies = Array(12).fill(0);
  const countsUsers = Array(12).fill(0);

  dashboard?.monthlyCount?.forEach((company: any) => {
    const [year, month] = company.month.split("-");
    console.log(year);
    const monthIndex = parseInt(month, 10) - 1;
    countsCompanies[monthIndex] = company.count;
  });

  users?.monthlyUsers?.forEach((user: any) => {
    const [year, month] = user.month.split("-");
    console.log(year);
    const monthIndex = parseInt(month, 10) - 1;
    countsUsers[monthIndex] = user.count;
  });

  const data:any = {
    labels: months,
    datasets: [
      {
        label: "Companies Joined",
        data: countsCompanies,
        fill: false,
        borderColor: "#03fc88",
        tension: 0.1,
      },
      {
        label: "Users Joined",
        data: countsUsers,
        fill: false,
        borderColor: "#fc03be",
        tension: 0.1,
      },
    ],
  };

  const options:any = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem:any) {
            return `Count: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="flex flex-col w-full bg-gray-50 p-6">
      <header className="mb-6">
        <h1 className="text-2xl text-center underline underline-offset-4 font-semibold font-bai-bold">
          Dashboard
        </h1>
      </header>
      <main className="flex flex-col gap-6 lg:flex-row lg:gap-6">
        <div className="flex-1 bg-white p-6  rounded-lg shadow-lg">
          <h2 className="text-xl  font-semibold mb-4">COMPANIES</h2>
          <div className="h-">
            <Line data={data} options={options} className="w-24 h-32" />
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-6 p-6">
          <div className="p-6 rounded-lg shadow-xl flex items-center gap-4 transition-transform transform hover:scale-105">
            <FaBuilding className="text-4xl text-blue-600" />
            <div>
              <h3 className="text-xl font-semibold mb-1">Total Companies</h3>
              <p className="text-3xl font-extrabold">{dashboard?.totalCount}</p>
            </div>
          </div>
          <div className="p-6 rounded-lg shadow-xl flex items-center gap-4 transition-transform transform hover:scale-105">
            <FaUser className="text-4xl text-green-600" />
            <div>
              <h3 className="text-xl font-semibold mb-1">Total Users</h3>
              <p className="text-3xl font-extrabold">{users?.users}</p>
            </div>
          </div>
          <div className="p-6 rounded-lg shadow-xl flex items-center gap-4 transition-transform transform hover:scale-105">
            <FaCog className="text-4xl text-red-600" />
            <div>
              <h3 className="text-xl font-semibold mb-1">Total Services</h3>
              <p className="text-3xl font-extrabold">
                {dashboard?.totalServices}
              </p>
            </div>
          </div>
        </div>
      </main>
      <section className="mt-6 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Companies Data</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboard?.companies.map((item:any, index:number) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={item.logo} alt="" className="w-16" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    }).format(new Date(item.createdAt))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.ownerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.companyName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.address.city}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
