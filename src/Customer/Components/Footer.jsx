import React from "react";
import cafeLogo from "../../assets/Iman Cafe Logo.png";
import { FaFacebookF, FaInstagram, FaTwitter, FaEnvelope, FaPhone } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white border-t-4 border-amber-400 shadow-inner mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-10">

        {/* Logo & About */}
        <div className="flex flex-col items-start gap-4">
          <img 
            src={cafeLogo} 
            alt="Iman Cafe Logo" 
            className="w-20 h-20 rounded-full object-cover shadow-md"
          />
          <h2 className="text-2xl font-bold text-amber-700">Iman Café</h2>
          <p className="text-gray-600 text-sm">
            Experience the taste of tradition with a modern twist. Come dine with us and enjoy a cozy ambiance.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-2 text-amber-700">
            <a href="#"><FaFacebookF className="hover:text-amber-900 transition-colors" /></a>
            <a href="#"><FaInstagram className="hover:text-amber-900 transition-colors" /></a>
            <a href="#"><FaTwitter className="hover:text-amber-900 transition-colors" /></a>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-3 text-gray-700">
          <h3 className="text-xl font-semibold text-amber-700 mb-2">Contact Us</h3>
          <p className="flex items-center gap-2"><FaPhone /> +91 12345 67890</p>
          <p className="flex items-center gap-2"><FaEnvelope /> info@imancafe.com</p>
          <p>123 Cafe Street, Kollam, Kerala</p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-3 text-gray-700">
          <h3 className="text-xl font-semibold text-amber-700 mb-2">Quick Links</h3>
          <a href="#" className="hover:text-amber-900 transition-colors">Home</a>
          <a href="#" className="hover:text-amber-900 transition-colors">Menu</a>
          <a href="#" className="hover:text-amber-900 transition-colors">Dine-IN</a>
          <a href="#" className="hover:text-amber-900 transition-colors">About Us</a>
          <a href="#" className="hover:text-amber-900 transition-colors">Contact</a>
        </div>

      </div>

      {/* Footer Bottom */}
      <div className="border-t border-amber-300 mt-6 py-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Iman Café. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
