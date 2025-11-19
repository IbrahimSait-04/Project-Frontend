import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../Components/Navbar.jsx";
import Footer from "../Components/Footer.jsx";

const CustomerSettings = () => {
  const [customer, setCustomer] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedCustomer = localStorage.getItem("customerData");
    if (!storedCustomer) {
      toast.error("Please log in again");
      navigate("/login");
      return;
    }
    setCustomer(JSON.parse(storedCustomer));
  }, [navigate]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async (field) => {
    try {
      // use correct customer token key
      const token = localStorage.getItem("customerToken");
      if (!token) throw new Error("No token found");

      const payloadValue = formData[field];
      if (!payloadValue && field !== "password") {
        toast.warn(`Please enter a new ${field} before saving`);
        return;
      }

      const { data } = await api.put(
        `/customer/${customer._id}`,
        { [field]: payloadValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem("customerData", JSON.stringify(data.customer));
      setCustomer(data.customer);
      setFormData((prev) => ({ ...prev, [field]: "" }));
      toast.success(`${field} updated successfully`);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to update ${field}`);
    }
  };

  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-yellow-100">
        <p className="text-gray-600 text-sm sm:text-base animate-pulse">
          Loading settings...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-100">
      <Navbar />

      <main className="flex-1 flex justify-center py-8 sm:py-10 px-4 sm:px-6">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">
            Account Settings
          </h2>

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Full Name
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  defaultValue={customer.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm sm:text-base"
                />
                <button
                  type="button"
                  onClick={() => handleUpdate("name")}
                  className="w-full sm:w-auto px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition text-sm sm:text-base"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Email
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  defaultValue={customer.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm sm:text-base"
                />
                <button
                  type="button"
                  onClick={() => handleUpdate("email")}
                  className="w-full sm:w-auto px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition text-sm sm:text-base"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Phone Number
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  defaultValue={customer.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm sm:text-base"
                />
                <button
                  type="button"
                  onClick={() => handleUpdate("phone")}
                  className="w-full sm:w-auto px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition text-sm sm:text-base"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Change Password
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="password"
                  placeholder="Enter new password"
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm sm:text-base"
                />
                <button
                  type="button"
                  onClick={() => handleUpdate("password")}
                  className="w-full sm:w-auto px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition text-sm sm:text-base"
                >
                  Save
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Make sure your new password is at least 8 characters long.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CustomerSettings;
