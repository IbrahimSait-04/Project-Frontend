import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

const CreateStaffs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "waiter",
  });
  const [loading, setLoading] = useState(false);

  const roles = ["waiter", "chef", "delivery boy", "receptionist"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const adminToken = localStorage.getItem("adminToken"); // read at submit time

    if (!adminToken) {
      toast.error("Admin not logged in!");
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      };

      const { data } = await api.post("/admin/staff", formData, config);

      toast.success(data?.message || "Staff member created successfully!");
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
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-amber-700 mb-6">
          Create Staff Member
        </h2>

        <p className="text-gray-500 text-center mb-8 text-sm sm:text-base">
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
              className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-400 focus:outline-none transition text-sm sm:text-base"
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
              className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-400 focus:outline-none transition text-sm sm:text-base"
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
              className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-400 focus:outline-none transition text-sm sm:text-base"
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
              className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-400 focus:outline-none transition text-sm sm:text-base"
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
            className={`w-full py-3 mt-4 rounded-xl font-semibold text-lg text-white shadow-md hover:shadow-lg transition duration-300 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creating Staff..." : "Create Staff"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateStaffs;
