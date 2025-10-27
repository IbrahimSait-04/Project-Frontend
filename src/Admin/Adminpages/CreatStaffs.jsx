import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CreateStaffs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "waiter",
  });
  const [loading, setLoading] = useState(false);

  const roles = ["waiter", "chef", "delivery boy", "receptionist"];
  const adminToken = localStorage.getItem("adminToken");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adminToken) return toast.error("Admin not logged in!");

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${adminToken}` } };
      const { data } = await axios.post(
        "http://localhost:5000/api/admin/staff",
        formData,
        config
      );

      toast.success(data.message || "Staff member created successfully!");
      setFormData({ name: "", email: "", password: "", role: "waiter" });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-amber-50 via-white to-amber-100 px-4 py-10">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg border border-amber-200 rounded-3xl shadow-2xl p-8 transition-transform hover:scale-[1.01]">
        <h2 className="text-3xl font-bold text-center text-amber-700 mb-6">
          Create Staff Member
        </h2>

        <p className="text-gray-500 text-center mb-8">
          Fill out the form below to add a new staff member.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-amber-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-400 focus:outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-400 focus:outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-400 focus:outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-700 mb-1">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-400 focus:outline-none transition"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-md hover:shadow-lg transition duration-300"
          >
            {loading ? "Creating Staff..." : "Create Staff"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateStaffs;
