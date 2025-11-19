import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import cafeLogo from "../../assets/Iman Cafe Logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/menu", label: "Menu" },
    { to: "/dineIn", label: "Dine-IN" },
    { to: "/cart", label: "Cart" },
    { to: "/contact", label: "Contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="w-full bg-white border-b-4 border-amber-400 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo + Brand */}
        <div className="flex items-center gap-3">
          <img
            src={cafeLogo}
            alt="Iman Cafe Logo"
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full object-cover shadow-lg"
          />
          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-700">
            Iman Café
          </span>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-8 text-gray-700 font-medium items-center">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`hover:text-amber-600 cursor-pointer transition-colors ${
                isActive(link.to) ? "text-amber-700 font-semibold" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}

          <Link
            to="/customer/profile"
            className="flex items-center gap-2 text-gray-700 cursor-pointer hover:text-amber-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-amber-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 17.804A7 7 0 1119.879 17.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="font-medium">Profile</span>
          </Link>
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col justify-center gap-1.5 p-2 rounded-md border border-amber-200 text-amber-700 active:scale-95 transition"
          onClick={toggleMenu}
        >
          <span className="text-xs font-semibold">
            {isOpen ? "Close" : "Menu"}
          </span>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-amber-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-2 text-gray-700 font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className={`py-2 rounded-md px-1 ${
                  isActive(link.to)
                    ? "text-amber-700 font-semibold bg-amber-50"
                    : "hover:text-amber-700 hover:bg-amber-50"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <hr className="my-2 border-amber-100" />

            <Link
              to="/customer/profile"
              onClick={closeMenu}
              className="flex items-center gap-2 py-2 rounded-md px-1 hover:text-amber-700 hover:bg-amber-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-amber-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A7 7 0 1119.879 17.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="font-medium text-sm">Profile</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
