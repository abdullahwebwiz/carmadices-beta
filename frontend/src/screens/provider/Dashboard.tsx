import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import ProviderSidebar from "../../components/provider/Sidebar";
import OrderList from "../../components/provider/OrderList"; // Import the OrderList component

const ProviderDashboard = () => {
  const { user, logout, isProvider } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("thisMonth"); // Default to showing all orders
  const [filteredOrders, setFilteredOrders] = useState([]);

  const isInCurrentMonth = (date: any) => {
    const currentDate = new Date();
    return (
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear()
    );
  };
  const isInLastMonth = (date: any) => {
    const currentDate = new Date();
    const lastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1
    );
    return (
      date.getMonth() === lastMonth.getMonth() &&
      date.getFullYear() === lastMonth.getFullYear()
    );
  };
  const isInCurrentWeek = (date: any) => {
    const currentDate = new Date();
    const firstDayOfWeek = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - currentDate.getDay()
    );
    const lastDayOfWeek = new Date(
      firstDayOfWeek.getFullYear(),
      firstDayOfWeek.getMonth(),
      firstDayOfWeek.getDate() + 6
    );
    return date >= firstDayOfWeek && date <= lastDayOfWeek;
  };
  const isToday = (date: any) => {
    const currentDate = new Date();
    return (
      date.getDate() === currentDate.getDate() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear()
    );
  };
  const isYesterday = (date: any) => {
    const currentDate = new Date();
    const yesterday = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - 1
    );
    return (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    );
  };
  const isInCurrentYear = (date: any) => {
    const currentDate = new Date();
    return date.getFullYear() === currentDate.getFullYear();
  };

  const filterOrders = () => {
    const ordersThisMonth = orders.filter((order: any) =>
      isInCurrentMonth(new Date(order.createdAt))
    );
    const ordersLastMonth = orders.filter((order: any) =>
      isInLastMonth(new Date(order.createdAt))
    );
    const ordersThisWeek = orders.filter((order: any) =>
      isInCurrentWeek(new Date(order.createdAt))
    );
    const ordersToday = orders.filter((order: any) =>
      isToday(new Date(order.createdAt))
    );
    const ordersYesterday = orders.filter((order: any) =>
      isYesterday(new Date(order.createdAt))
    );
    const ordersThisYear = orders.filter((order: any) =>
      isInCurrentYear(new Date(order.createdAt))
    );

    switch (selectedTimePeriod) {
      case "thisMonth":
        setFilteredOrders(ordersThisMonth);
        break;
      case "lastMonth":
        setFilteredOrders(ordersLastMonth);
        break;
      case "thisWeek":
        setFilteredOrders(ordersThisWeek);
        break;
      case "today":
        setFilteredOrders(ordersToday);
        break;
      case "yesterday":
        setFilteredOrders(ordersYesterday);
        break;
      case "thisYear":
        setFilteredOrders(ordersThisYear);
        break;
      default:
        setFilteredOrders(orders);
        break;
    }
  };

  useEffect(() => {
    if (!user) {
      console.log("No user data found. Redirecting to login...");
      navigate("/login");
    } else if (!user.isProvider) {
      console.log("User is not a provider. Redirecting to login...");
      navigate("/login");
    } else {
      fetchOrders();
    }
  }, [user, navigate]);

  useEffect(() => {
    filterOrders();
  }, [orders, selectedTimePeriod]);

  // Rest of your component code...

  // Fetch orders function
  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "https://carmadices-beta-11pk.vercel.app/provider/assigned",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
        setLoading(false);
      } else {
        throw new Error("Failed to fetch orders.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
      alert(
        "Failed to fetch orders. Please check your connection and try again."
      );
    }
  };

  // Calculate the order count, completed orders, pending orders, etc. based on the filteredOrders
  const orderCount = filteredOrders.length;
  const completedOrders = filteredOrders.filter(
    (order: any) => order.status === "Completed"
  ).length;
  const pendingOrders = filteredOrders.filter(
    (order: any) => order.status === "Pending"
  ).length;
  const completedOrdersWaitingForAdminCheck = filteredOrders.filter(
    (order: any) => order.status === "Completed" && !order.adminCheck
  ).length;
  const cashForAcceptedOrders = filteredOrders
    .filter((order: any) => order.adminCheck)
    .reduce((total, order:any) => total + order.totalPrice * 0.7, 0)
    .toFixed(2);
  const cashForCompletedButPendingCheck = filteredOrders
    .filter((order: any) => order.status === "Completed" && !order.adminCheck)
    .reduce((total, order:any) => total + order.totalPrice * 0.7, 0)
    .toFixed(2);
  const cashForPendingOrders = filteredOrders
    .filter((order: any) => order.status === "Pending")
    .reduce((total, order:any) => total + order.totalPrice * 0.7, 0)
    .toFixed(2);

  const handleTimeRangeChange = (selectedTimeRange: any) => {
    setSelectedTimePeriod(selectedTimeRange);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <ProviderSidebar logout={logout} />
      {/* Content Area */}
      <div className="bg-blue/25 flex-1 overflow-y-auto">
        <h1 className="p-8 lg:text-5xl text-4xl font-black bg-gray-800 text-white text-center lg:text-left">
          Dashboard
        </h1>
        <div className="lg:p-8 p-4">
          <div className="grid lg:grid-cols-6 grid-cols-2 gap-2 mb-4">
            <button
              className={`p-4 rounded-md transition-colors duration-300 ${
                selectedTimePeriod === "thisMonth"
                  ? "bg-blue text-white"
                  : "bg-gray-800 text-white"
              } hover:bg-blue hover:text-white`}
              onClick={() => handleTimeRangeChange("thisMonth")}
            >
              This Month
            </button>
            <button
              className={`p-4 rounded-md transition-colors duration-300 ${
                selectedTimePeriod === "lastMonth"
                  ? "bg-blue text-white"
                  : "bg-gray-800 text-white"
              } hover:bg-blue hover:text-white`}
              onClick={() => handleTimeRangeChange("lastMonth")}
            >
              Last Month
            </button>
            <button
              className={`p-4 rounded-md transition-colors duration-300 ${
                selectedTimePeriod === "thisWeek"
                  ? "bg-blue text-white"
                  : "bg-gray-800 text-white"
              } hover:bg-blue hover:text-white`}
              onClick={() => handleTimeRangeChange("thisWeek")}
            >
              This Week
            </button>
            <button
              className={`p-4 rounded-md transition-colors duration-300 ${
                selectedTimePeriod === "today"
                  ? "bg-blue text-white"
                  : "bg-gray-800 text-white"
              } hover:bg-blue hover:text-white`}
              onClick={() => handleTimeRangeChange("today")}
            >
              Today
            </button>
            <button
              className={`p-4 rounded-md transition-colors duration-300 ${
                selectedTimePeriod === "yesterday"
                  ? "bg-blue text-white"
                  : "bg-gray-800 text-white"
              } hover:bg-blue hover:text-white`}
              onClick={() => handleTimeRangeChange("yesterday")}
            >
              Yesterday
            </button>
            <button
              className={`p-4 rounded-md transition-colors duration-300 ${
                selectedTimePeriod === "thisYear"
                  ? "bg-blue text-white"
                  : "bg-gray-800 text-white"
              } hover:bg-blue hover:text-white`}
              onClick={() => handleTimeRangeChange("thisYear")}
            >
              This Year
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="bg-white p-8 w-full rounded-lg border border-gray-300 items-center text-center flex flex-col gap-2">
              <p className="font-bold">Total Orders</p>
              <p className="text-4xl">{orderCount}</p>
            </div>
            <div className="bg-white p-8 w-full rounded-lg border border-gray-300 items-center text-center flex flex-col gap-2">
              <p className="font-bold">Current Cash</p>
              <p className="text-4xl">${user.cash.toFixed(2)}</p>
            </div>
            <div className="bg-white p-8 w-full rounded-lg border border-gray-300 items-center text-center flex flex-col gap-2">
              <p className="font-bold">Completed Orders</p>
              <p className="text-4xl">{completedOrders}</p>
            </div>
            <div className="bg-white p-8 w-full rounded-lg border border-gray-300 items-center text-center flex flex-col gap-2">
              <p className="font-bold">Pending Orders</p>
              <p className="text-4xl">{pendingOrders}</p>
            </div>
            <div className="bg-white p-8 w-full rounded-lg border border-gray-300 items-center text-center flex flex-col gap-2">
              <p className="font-bold">Pending Check</p>
              <p className="text-4xl">{completedOrdersWaitingForAdminCheck}</p>
            </div>
            <div className="bg-white p-8 w-full rounded-lg border border-gray-300 items-center text-center flex flex-col gap-2">
              <p className="font-bold">Accepted Orders</p>
              <p className="text-4xl">${cashForAcceptedOrders}</p>
            </div>
            <div className="bg-white p-8 w-full rounded-lg border border-gray-300 items-center text-center flex flex-col gap-2">
              <p className="font-bold">Pending Check</p>
              <p className="text-4xl">${cashForCompletedButPendingCheck}</p>
            </div>
            <div className="bg-white p-8 w-full rounded-lg border border-gray-300 items-center text-center flex flex-col gap-2">
              <p className="font-bold">Pending Orders</p>
              <p className="text-4xl">${cashForPendingOrders}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
