// src/pages/staff/StaffHome.jsx
import React from "react";
import { Outlet, NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Pencil,
  Settings,
  LogOut,
} from "lucide-react";

const staffNavItems = [
  { name: "Dashboard", path: "/staff", icon: LayoutDashboard }, // index
  { name: "Profile", path: "/staff/profile", icon: User },
  { name: "Edit Menu", path: "/staff/editmenu", icon: Pencil },
  { name: "Settings", path: "/staff/settings", icon: Settings },
];

const StaffHome = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/staff") return location.pathname === "/staff";
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("staffToken");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100">
      <aside className="w-64 bg-white shadow-xl flex flex-col justify-between">
        <div>
          <div className="p-4 border-b border-yellow-100">
            <h1 className="text-xl font-bold text-amber-800">Imman Café</h1>
            <p className="text-sm text-gray-500">Staff Portal</p>
          </div>

          <div className={`p-4 ${isActive("/staff/profile") ? "bg-yellow-100" : ""}`}>
            <Link to="/staff/profile" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-400 text-white flex items-center justify-center text-xl font-bold rounded-full shadow-md">
                A
              </div>
              <div>
                <p className="font-semibold text-gray-800">Staff User</p>
                <p className="text-sm text-gray-500">View Profile</p>
              </div>
            </Link>
          </div>

          <div className="px-4 py-2 uppercase text-xs font-semibold text-gray-500">Main Menu</div>

          <nav className="space-y-1 px-4 pb-6">
            {staffNavItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/staff"}
                className={({ isActive: navIsActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    navIsActive ? "bg-amber-500 text-white font-semibold shadow-md" : "text-gray-700 hover:bg-yellow-50"
                  }`
                }
              >
                <item.icon size={18} /> <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-yellow-100">
          <button
            onClick={handleLogout}
            className="flex items-center justify-start gap-3 w-full text-red-600 hover:text-red-700 font-semibold py-2 px-3 rounded-lg transition-all duration-300 hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Content area - children render here */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default StaffHome;
