import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import cafeLogo from "../assets/Iman Cafe Logo.png";
import api from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let endpoint = "/customer/login";
      if (role === "staff") endpoint = "/staff/login";
      if (role === "admin") endpoint = "/admin/login";

      const { data } = await api.post(endpoint, { email, password });

      console.log(" Logged In:", data);

      //  Clear old data
      localStorage.removeItem("staffData");
      localStorage.removeItem("adminData");
      localStorage.removeItem("customerData");
      localStorage.removeItem("customerId");
      localStorage.removeItem("customerToken");
      localStorage.removeItem("staffToken");
      localStorage.removeItem("adminToken");

      // Save according to role
      if (role === "staff") {
        localStorage.setItem("staffToken", data.token);
        localStorage.setItem("staffData", JSON.stringify(data.staff));
        toast.success(`Welcome, ${data.staff.name}!`);
        return navigate("/staff/");
      }

      if (role === "admin") {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminData", JSON.stringify(data.admin));
        toast.success(`Welcome Admin, ${data.admin.name}!`);
        return navigate("/admin");
      }

      //  Customer default
      localStorage.setItem("customerToken", data.token);
      localStorage.setItem("customerData", JSON.stringify(data.customer));
      localStorage.setItem("customerId", data.customer.id);
      toast.success(`Welcome ${data.customer.name}!`);
      navigate("/");
      
    } catch (error) {
      console.error(" Login error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-amber-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
        <img src={cafeLogo} alt="Iman Cafe Logo" className="w-12 h-12 md:w-16 md:h-16 rounded-full shadow-lg" />
        <span className="text-2xl md:text-3xl font-bold text-amber-700">Iman Café</span>
      </div>

      <div className="flex items-center justify-center p-4">
        <div className="flex flex-col md:flex-row bg-white/90 shadow-2xl rounded-2xl border border-amber-200 overflow-hidden w-full max-w-4xl">
          <div className="md:w-1/2 flex items-center justify-center bg-amber-50 p-6">
            <img src={cafeLogo} className="w-40 h-40 md:w-48 md:h-48 rounded-full shadow-lg object-cover" alt="logo" />
          </div>

          <div className="md:w-1/2 p-10 flex flex-col justify-center">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-700">Welcome To <span className="text-amber-600">Iman Café</span>!</h1>
              <p className="text-gray-500 mt-2">Please login to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <input type="email" placeholder="Email" className="border border-amber-300 p-3 rounded-lg focus:ring-2 focus:ring-amber-500"
                value={email} onChange={(e) => setEmail(e.target.value)} required />

              <input type="password" placeholder="Password" className="border border-amber-300 p-3 rounded-lg focus:ring-2 focus:ring-amber-500"
                value={password} onChange={(e) => setPassword(e.target.value)} required />

              <select value={role} onChange={(e) => setRole(e.target.value)}
                className="border border-amber-300 p-3 rounded-lg focus:ring-2 focus:ring-amber-500">
                <option value="customer">Customer</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>

              <button type="submit" className="bg-amber-700 text-white font-semibold py-3 rounded-lg hover:bg-amber-800 transition-all shadow-md">Login</button>
            </form>

            <div className="mt-6 text-center text-gray-600 text-sm">
              New here? <Link to="/Signup" className="text-amber-700 font-medium hover:underline">Create an account</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
