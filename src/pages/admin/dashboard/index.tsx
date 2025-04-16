import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ShoppingBag } from "lucide-react";

import {
  salesData,
  revenueData,
  statsCards,
} from "../../../database/admin/dashboard";
import { AuthProps, isLoginAdminAuth } from "../../../components/withAuth";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC<AuthProps> = ({ user }) => {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back, {user?.firstName}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-6 transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  {card.title}
                </h2>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </div>
              <div
                className={`p-3 rounded-full ${card.iconBg} ${card.iconColor}`}
              >
                {card.icon}
              </div>
            </div>
            <div
              className={
                card.change.startsWith("+") ? "text-green-600" : "text-red-600"
              }
            >
              {card.change} from last month
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Revenue Trend
          </h2>
          <Line data={revenueData} />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Sales by Category
          </h2>
          <Bar data={salesData} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          Recent Activities
        </h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="bg-[#f5ecd1] text-[#C8A846] p-2 rounded-full mr-4">
                <ShoppingBag size={16} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium text-gray-800">
                    New order #{Math.floor(Math.random() * 10000)}
                  </h3>
                  <span className="text-sm text-gray-500">2 hours ago</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Customer purchased Eyewear for $
                  {Math.floor(Math.random() * 500 + 50)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const DashboardWrapper = isLoginAdminAuth(Dashboard);

export default DashboardWrapper;
