import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

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
    setFormData({ ...formData, [field]: value });
  };

  const handleUpdate = async (field) => {
    try {
      const token = localStorage.getItem("customerToken");
      if (!token) throw new Error("No token found");

      const { data } = await api.put(
        `/customer/${customer._id}`,
        { [field]: formData[field] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem("customerData", JSON.stringify(data.customer));
      setCustomer(data.customer);
      toast.success(`${field} updated successfully`);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to update ${field}`);
    }
  };
  if (!customer)
    return <p className="text-center mt-10 text-gray-600">Loading settings...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md border border-gray-200 p-8">
       
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Account Settings</h2>

        
        <div className="space-y-6">
       
          <div>
            <label className="block text-gray-700 font-medium mb-2">Full Name</label>
            <div className="flex gap-3">
              <input
                type="text"
                defaultValue={customer.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-amber-400"
              />
              <button
                onClick={() => handleUpdate("name")}
                className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
              >
                Save
              </button>
            </div>
          </div>

        
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <div className="flex gap-3">
              <input
                type="email"
                defaultValue={customer.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-amber-400"
              />
              <button
                onClick={() => handleUpdate("email")}
                className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
              >
                Save
              </button>
            </div>
          </div>

          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
            <div className="flex gap-3">
              <input
                type="text"
                defaultValue={customer.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-amber-400"
              />
              <button
                onClick={() => handleUpdate("phone")}
                className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
              >
                Save
              </button>
            </div>
          </div>

         
          <div>
            <label className="block text-gray-700 font-medium mb-2">Change Password</label>
            <div className="flex gap-3">
              <input
                type="password"
                placeholder="Enter new password"
                onChange={(e) => handleChange("password", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-amber-400"
              />
              <button
                onClick={() => handleUpdate("password")}
                className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSettings;
