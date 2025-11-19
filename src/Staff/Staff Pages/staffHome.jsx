import React from "react";
import { Outlet, NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Pencil,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const staffNavItems = [
  { name: "Dashboard", path: "/staff", icon: LayoutDashboard }, 
  { name: "Profile", path: "/staff/profile", icon: User },
  { name: "Edit Menu", path: "/staff/editmenu", icon: Pencil },
];

const StaffHome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const isActive = (path) => {
    if (path === "/staff") return location.pathname === "/staff";
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("staffToken");
    navigate("/login");
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const closeSidebarOnMobile = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 flex">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={closeSidebarOnMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl flex flex-col justify-between transform transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0`}
      >
        <div>
          <div className="p-4 border-b border-yellow-100">
            <h1 className="text-xl font-bold text-amber-800">Imman Café</h1>
            <p className="text-sm text-gray-500">Staff Portal</p>
          </div>

          <div className={`p-4 ${isActive("/staff/profile") ? "bg-yellow-100" : ""}`}>
            <Link to="/staff/profile" className="flex items-center gap-3" onClick={closeSidebarOnMobile}>
              <div className="w-12 h-12 bg-amber-400 text-white flex items-center justify-center text-xl font-bold rounded-full shadow-md">
                A
              </div>
              <div>
                <p className="font-semibold text-gray-800">Staff User</p>
                <p className="text-sm text-gray-500">View Profile</p>
              </div>
            </Link>
          </div>

          <div className="px-4 py-2 uppercase text-xs font-semibold text-gray-500">
            Main Menu
          </div>

          <nav className="space-y-1 px-4 pb-6">
            {staffNavItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/staff"}
                onClick={closeSidebarOnMobile}
                className={({ isActive: navIsActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    navIsActive
                      ? "bg-amber-500 text-white font-semibold shadow-md"
                      : "text-gray-700 hover:bg-yellow-50"
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
            onClick={() => {
              handleLogout();
              closeSidebarOnMobile();
            }}
            className="flex items-center justify-start gap-3 w-full text-red-600 hover:text-red-700 font-semibold py-2 px-3 rounded-lg transition-all duration-300 hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur shadow-sm">
          <div>
            <h1 className="text-lg font-bold text-amber-800">Imman Café</h1>
            <p className="text-xs text-gray-500">Staff Portal</p>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg border border-yellow-200 bg-yellow-50 active:scale-95 transition"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StaffHome;
