import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, UserPlus, FilePlus } from "lucide-react"; // icons

const AdminNavbar = () => {
  return (
    <aside className="w-64 h-screen bg-white shadow-lg fixed top-0 left-0 flex flex-col">
      {/* Logo / Header */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-blue-600">Admin Panel</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        {/* Dashboard */}
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
              isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        {/* Customers */}
        <NavLink
          to="/admin/getcustomers"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
              isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <Users size={20} />
          Customers
        </NavLink>

        {/* Staff */}
        <NavLink
          to="/admin/creatstaff"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
              isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <UserPlus size={20} />
          Create Staff
        </NavLink>

        {/* Menu */}
        <NavLink
          to="/admin/createmenu"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
              isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <FilePlus size={20} />
          Create Menu
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminNavbar;
