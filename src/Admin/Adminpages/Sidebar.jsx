import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="bg-gray-200 w-60 h-screen p-5">
      <nav className="flex flex-col gap-4">

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            isActive ? "font-bold text-blue-600" : "text-gray-700"
          }
        >
          Orders
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
