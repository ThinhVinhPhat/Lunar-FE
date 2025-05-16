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
import { Eye, ShoppingBag } from "lucide-react";
import {
  AuthProps,
  isLoginAdminAuth,
} from "../../../components/wrapper/withAuth";
import { useGetSummary } from "../../../hooks/queryClient/query/analytics/getSummary";
import { useGetCompareLastMonth } from "../../../hooks/queryClient/query/analytics/getLastMonth";
import { transFormCard, transFormRevenue } from "../../../ultis/transFormCard";
import { Product } from "../../../types/product";
import { useGetMonthRevenue } from "../../../hooks/queryClient/query/analytics/getMonthRevenue";
import { useGetUserOrder } from "../../../hooks/queryClient/query/analytics/getUserOrder";
import { OrderFilterEnum, UserOrderType } from "../../../types/analytic";
import { useState } from "react";
import { Pagination } from "../../../components/ui/Pagination";

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
  const { data: summary } = useGetSummary();
  const [page, setPage] = useState(0);
  const offset = page * 10;
  const limit = 10;
  const { data: compareLastMonth } = useGetCompareLastMonth(summary);
  const [orderFilter, setOrderFilter] = useState<OrderFilterEnum>(
    OrderFilterEnum.RECENT
  );
  const { data: userOrder } = useGetUserOrder(offset, limit, orderFilter);
  const statsCards = transFormCard(summary, compareLastMonth);
  const { data: revenue } = useGetMonthRevenue();
  const revenueData = transFormRevenue(revenue);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back, {user?.lastName}!</p>
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
              className={card.isIncrease ? "text-green-600" : "text-red-600"}
            >
              {card.change} from last month
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          Top Viewed Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {summary?.topProducts
            ?.slice(0, 3)
            .map((product: Product, index: number) => (
              <div
                key={index}
                className="flex flex-col bg-gray-50 rounded-lg overflow-hidden transition-all hover:shadow-md border border-gray-100"
              >
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <img
                    src={product.images?.[0] || "/placeholder-product.jpg"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 bg-[#C8A846] text-white text-xs font-bold px-2 py-1 rounded-full">
                    #{index + 1} Most Viewed
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-medium text-gray-800 mb-1 truncate">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-bold text-[#C8A846]">
                      ${product.price}
                    </span>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Eye size={16} className="mr-1" />
                      <span>{product.views} views</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Revenue Trend
          </h2>
          <Line data={revenueData.revenueData} />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Sales by Category
          </h2>
          <Bar data={revenueData.salesData} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-800">
            Recent Activities
          </h2>
          <div className="relative">
            <select
              className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8A846] focus:border-transparent"
              onChange={(e) =>
                setOrderFilter(e.target.value as OrderFilterEnum)
              }
              value={orderFilter}
            >
              {Object.values(OrderFilterEnum).map((filter) => (
                <option key={filter} value={filter}>
                  {filter}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {userOrder?.orders?.map((item: UserOrderType) => (
            <div
              key={item.id}
              className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="bg-[#f5ecd1] text-[#C8A846] p-2 rounded-full mr-4">
                <ShoppingBag size={16} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium text-gray-800">
                    New order #{item.id}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {item.timeSinceOrder}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  Customer purchased Eyewear for ${item.total_price}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Pagination
          currentPage={page}
          onSetPage={setPage}
          productCount={userOrder?.length}
        />
      </div>
    </>
  );
};

const DashboardWrapper = isLoginAdminAuth(Dashboard);

export default DashboardWrapper;
