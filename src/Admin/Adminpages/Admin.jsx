import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
 LogOut,
 User,
 LayoutDashboard,
 Users,
 PlusCircle,
 ClipboardList,
 Settings,
} from "lucide-react";
import api from "../../services/api"; 

const AdmiDashboard = () => {
 const navigate = useNavigate();
 const [admin, setAdmin] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");

 const navItems = [
  { to: "adminprofile", label: "Profile", icon: <User size={18} /> },
   { to: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { to: "/admin/getcustomer", label: "Customers", icon: <Users size={18} /> },
  { to: "/admin/createstaff", label: "Add Staff", icon: <PlusCircle size={18} /> },
  { to: "/admin/getstaff", label: "Staff Directory", icon: <ClipboardList size={18} /> },
  { to: "/admin/createmenu", label: "Create Menu", icon: <ClipboardList size={18} /> },
  { to: "editmenu", label: "Edit Menu", icon: <Settings size={18} /> },
  { to: "settings", label: "Settings", icon: <Settings size={18} /> },
 ];

 
 useEffect(() => {
  const fetchAdmin = async () => {
   try {
    const token = localStorage.getItem("adminToken"); 
    if (!token) {
     navigate("/login");
     return;
    }

    const { data } = await api.get("/admin/profile", {
     headers: {
      Authorization: `Bearer ${token}`,
     },
    });

    setAdmin(data);
   } catch (err) {
    console.error("Error fetching admin profile:", err);
    setError("Failed to load admin profile");
    navigate("/login");
   } finally {
    setLoading(false);
   }
  };

  fetchAdmin();
 }, [navigate]);

 const handleLogout = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminData");
  localStorage.removeItem("role");
  navigate("/login");
 };

 if (loading) {
  return (
   <div className="flex items-center justify-center min-h-screen text-lg text-gray-700">
    Loading admin dashboard...
   </div>
  );
 }

 if (error) {
  return (
   <div className="flex items-center justify-center min-h-screen text-red-600">
    {error}
   </div>
  );
 }

 return (
  <div className="flex min-h-screen bg-amber-50">
   {/* Sidebar */}
   <aside className="w-72 bg-white shadow-xl flex flex-col">
    {/* Header */}
    <div className="p-6 flex items-center gap-3 border-b border-gray-200">
     <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white w-10 h-10 flex items-center justify-center rounded-xl font-bold">
      I
     </div>
     <div>
      <h1 className="text-lg font-semibold text-gray-800">Imman Café</h1>
      <p className="text-xs text-gray-500">Admin Portal</p>
     </div>
    </div>

    <div className="p-4 flex-1">
     {/* Admin Info */}
     <div className="bg-amber-100 p-4 rounded-xl flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-amber-500 text-white rounded-full flex items-center justify-center font-semibold">
       {admin?.name?.charAt(0).toUpperCase() || "A"}
      </div>
      <div>
       <p className="font-semibold text-gray-800">{admin?.name}</p>
       <p className="text-sm text-gray-600">{admin?.role}</p>
       <p className="text-xs text-gray-500">{admin?.email}</p>
      </div>
     </div>

     {/* Navigation */}
     <nav className="flex flex-col gap-2">
      <h3 className="text-xs text-gray-400 uppercase font-semibold mb-1">
       Main Menu
      </h3>
      {navItems.map((item) => (
       <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) =>
         `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
          isActive
           ? "bg-amber-500 text-white"
           : "text-gray-700 hover:bg-amber-100"
         }`
        }
       >
        {item.icon}
        {item.label}
       </NavLink>
      ))}
     </nav>

     {/* Logout */}
     <div className="mt-auto pt-6 border-t border-gray-200">
      <button
       onClick={handleLogout}
       className="flex items-center gap-3 text-red-600 font-medium text-sm hover:bg-red-50 px-3 py-2 rounded-lg transition-all"
      >
       <LogOut size={18} /> Logout
      </button>
     </div>
    </div>
   </aside>

   {/* Main Content */}
   <main className="flex-1 p-6">
    <div className="flex justify-between items-center mb-8">
     <div>
      <h1 className="text-2xl font-bold text-gray-900">
       Welcome back, {admin?.name || "Admin"}!
      </h1>
      <p className="text-sm text-gray-500">
       {new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
       })}
      </p>
     </div>
    </div>

    <div className="bg-white rounded-2xl shadow-xl p-8">
     <Outlet />
    </div>
   </main>
  </div>
 );
};

export default AdmiDashboard;