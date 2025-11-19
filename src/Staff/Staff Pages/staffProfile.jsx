import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaUserAlt, FaEnvelope, FaUserTie } from "react-icons/fa";
import api from "../../services/api";

const StaffProfile = () => {
  const [staff, setStaff] = useState(null);
  const [updateField, setUpdateField] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedStaff = localStorage.getItem("staffData");
    const token = localStorage.getItem("staffToken");

    if (!storedStaff || !token) {
      toast.error("No staff logged in! Please login again.");
      setLoading(false);
      return;
    }

    setStaff(JSON.parse(storedStaff));
    setLoading(false);
  }, []);

  const handleChange = (field, value) => {
    setUpdateField({ ...updateField, [field]: value });
  };

  const handleUpdate = async (field) => {
    try {
      const token = localStorage.getItem("staffToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = { [field]: updateField[field] };
      const { data } = await api.put(`/staff/${staff._id}`, payload, config);

      setStaff(data.staff);
      localStorage.setItem("staffData", JSON.stringify(data.staff));
      toast.success(`${field} updated successfully`);
    } catch (error) {
      toast.error(`Failed to update ${field}`);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!staff) return <p className="text-center mt-10">No staff data found</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-6 px-3 md:px-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-amber-50 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-6 text-center md:text-left">
          <div className="w-24 h-24 bg-amber-200 rounded-full flex items-center justify-center text-4xl text-amber-700 shadow-md shrink-0">
            <FaUserAlt />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{staff.name}</h2>
            <p className="flex justify-center md:justify-start items-center gap-2 text-gray-600 mt-1">
              <FaUserTie /> {staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}
            </p>
            <p className="flex justify-center md:justify-start items-center gap-2 text-gray-600 mt-1">
              <FaEnvelope /> {staff.email}
            </p>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="p-6 md:p-8 space-y-6">

          {/* Name */}
          <div className="flex flex-col md:flex-row items-center gap-3">
            <label className="w-full md:w-32 font-semibold text-gray-700">Full Name:</label>
            <input
              type="text"
              defaultValue={staff.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-400 bg-gray-50"
            />
            <button
              onClick={() => handleUpdate("name")}
              className="w-full md:w-auto bg-amber-600 text-white px-5 py-2 rounded-lg hover:bg-amber-700 shadow-md transition"
            >
              Update
            </button>
          </div>

          {/* Email */}
          <div className="flex flex-col md:flex-row items-center gap-3">
            <label className="w-full md:w-32 font-semibold text-gray-700">Email:</label>
            <input
              type="email"
              defaultValue={staff.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-400 bg-gray-50"
            />
            <button
              onClick={() => handleUpdate("email")}
              className="w-full md:w-auto bg-amber-600 text-white px-5 py-2 rounded-lg hover:bg-amber-700 shadow-md transition"
            >
              Update
            </button>
          </div>

          {/* Password */}
          <div className="flex flex-col md:flex-row items-center gap-3">
            <label className="w-full md:w-32 font-semibold text-gray-700">Password:</label>
            <input
              type="password"
              placeholder="Enter new password"
              onChange={(e) => handleChange("password", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-400 bg-gray-50"
            />
            <button
              onClick={() => handleUpdate("password")}
              className="w-full md:w-auto bg-amber-600 text-white px-5 py-2 rounded-lg hover:bg-amber-700 shadow-md transition"
            >
              Update
            </button>
          </div>

          {/* Role */}
          <div className="flex flex-col md:flex-row items-center gap-3">
            <label className="w-full md:w-32 font-semibold text-gray-700">Role:</label>
            <select
              defaultValue={staff.role}
              onChange={(e) => handleChange("role", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-400 bg-gray-50"
            >
              <option value="waiter">Waiter</option>
              <option value="chef">Chef</option>
              <option value="delivery boy">Delivery Boy</option>
              <option value="receptionist">Receptionist</option>
            </select>
            <button
              onClick={() => handleUpdate("role")}
              className="w-full md:w-auto bg-amber-600 text-white px-5 py-2 rounded-lg hover:bg-amber-700 shadow-md transition"
            >
              Update
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
