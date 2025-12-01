import React from "react";
import { Link, useLocation } from "react-router-dom";
import cafeLogo from "../../assets/Iman Cafe Logo.png";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

const Footer = () => {
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/menu", label: "Menu" },
    { to: "/dineIn", label: "Dine-IN" },
    { to: "/cart", label: "Cart" },
    { to: "/contact", label: "Contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <footer className="bg-white border-t-4 border-amber-400 shadow-inner mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 text-center md:text-left">

        {/* Logo & About */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <img
            src={cafeLogo}
            alt="Iman Cafe Logo"
            className="w-20 h-20 rounded-full object-cover shadow-md"
          />
          <h2 className="text-2xl font-bold text-amber-700">Iman Café</h2>
          <p className="text-gray-600 text-sm max-w-sm">
            Experience the taste of tradition with a modern twist. Come dine
            with us and enjoy a cozy ambiance.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-2 text-amber-700">
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-amber-50 hover:bg-amber-100 hover:text-amber-900 transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-amber-50 hover:bg-amber-100 hover:text-amber-900 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-amber-50 hover:bg-amber-100 hover:text-amber-900 transition"
            >
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-3 items-center md:items-start text-gray-700">
          <h3 className="text-xl font-semibold text-amber-700 mb-1">
            Contact Us
          </h3>
          <p className="flex items-center gap-2 text-sm">
            <FaPhone /> +91 12345 67890
          </p>
          <p className="flex items-center gap-2 text-sm">
            <FaEnvelope /> info@imancafe.com
          </p>
          <p className="text-sm">123 Cafe Street, Kollam, Kerala</p>
        </div>

        {/* Quick Links  */}
        <div className="flex flex-col gap-2 items-center md:items-start text-gray-700">
          <h3 className="text-xl font-semibold text-amber-700 mb-1">
            Quick Links
          </h3>

          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm py-1 px-1 rounded-md transition-colors ${
                isActive(link.to)
                  ? "text-amber-700 font-semibold bg-amber-50"
                  : "hover:text-amber-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-amber-300 mt-4 py-3 text-center text-gray-500 text-xs sm:text-sm">
        &copy; {new Date().getFullYear()} Iman Café. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
