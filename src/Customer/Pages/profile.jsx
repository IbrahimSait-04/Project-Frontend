import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaUserAlt, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

const CustomerProfile = () => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomer = async () => {
      const token = localStorage.getItem("customerToken");
      const storedCustomer = localStorage.getItem("customerData");
      const customerId = localStorage.getItem("customerId");

      if (!token || !customerId) {
        toast.error("Session expired! Please log in again.");
        navigate("/login");
        return;
      }

      if (storedCustomer) {
        setCustomer(JSON.parse(storedCustomer));
      }

      try {
        const { data } = await api.get(`/customer/${customerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data?.customer) {
          setCustomer(data.customer);
          localStorage.setItem("customerData", JSON.stringify(data.customer));
        }
      } catch (err) {
        console.warn("Error fetching customer:", err?.response?.data || err.message);
        if (customerId !== "undefined") toast.warn("Using cached data.");
      }

      setLoading(false);
    };

    setTimeout(fetchCustomer, 300);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("customerData");
    localStorage.removeItem("customerToken");
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const sections = [
    {
      title: "My Orders",
      description: "Track, return, or view past orders",
      icon: "📦",
      action: () => navigate("/myorders"),
    },
    {
      title: "Reservations",
      description: "View and manage dine-in reservations",
      icon: "🍽️",
      action: () => navigate("/customer/reservations"),
    },
    {
      title: "Support",
      description: "Get help or contact customer service",
      icon: "🧰",
      action: () => navigate("/contact"),
    },
    {
      title: "Settings",
      description: "Update profile details and preferences",
      icon: "⚙️",
      action: () => navigate("/customer/settings"),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-sm sm:text-base animate-pulse">
          Loading your profile...
        </p>
      </div>
    );
  }

  if (!customer) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-100">
      
      {/* Header / Profile bar */}
      <div className="bg-white/90 shadow-sm border-b border-amber-100 py-6 sm:py-8 px-4 sm:px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-200 rounded-full flex items-center justify-center text-3xl sm:text-4xl text-amber-700 shadow-md">
            <FaUserAlt />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
              {customer.name}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {customer.email}
            </p>
          </div>
        </div>

        {/* Buttons RIGHT side */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition text-sm sm:text-base"
          >
            Back To Home
          </Link>

          <button
            onClick={handleLogout}
            className="px-4 sm:px-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition flex items-center gap-2 text-sm sm:text-base font-medium"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
          Your Account
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {sections.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="bg-white/90 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer border border-gray-100 hover:border-amber-500 text-left"
            >
              <div className="text-3xl sm:text-4xl mb-3">{item.icon}</div>
              <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-1">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                {item.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
