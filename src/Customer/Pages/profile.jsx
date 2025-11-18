import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaUserAlt, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
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
    { title: "My Orders", description: "Track, return, or view past orders", icon: "📦", action: () => navigate("/myorders") },
    { title: "Reservations", description: "View and manage dine-in reservations", icon: "🍽️" , action: () => navigate("/customer/reservations")},
    { title: "Support", description: "Get help or contact customer service", icon: "🧰" , action: () => navigate("/contact") },
    {
      title: "Settings",
      description: "Update profile details and preferences",
      icon: "⚙️",
      action: () => navigate("/customer/settings"),
    },
  ];

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!customer) return null; 

  return (
    <div className="min-h-screen bg-gray-50">
     
      <div className="bg-white shadow-sm py-8 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-amber-200 rounded-full flex items-center justify-center text-4xl text-amber-700 shadow-md">
            <FaUserAlt />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">{customer.name}</h1>
            <p className="text-gray-600 text-sm">{customer.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-4 md:mt-0 px-5 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition flex items-center gap-2"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Account</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((item, index) => (
            <div
              key={index}
              onClick={item.action}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 hover:border-amber-500"
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="text-lg font-medium text-gray-800 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
