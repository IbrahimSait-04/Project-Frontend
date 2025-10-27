import React from "react";
import cafeLogo from "../../assets/Iman Cafe Logo.png"
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full bg-white border-b-3 py-2 px-2  border-amber-400 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
  
        <div className="flex items-center gap-3">
          <img 
            src={cafeLogo} 
            alt="Iman Cafe Logo" 
            className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover shadow-lg" 
          />
          <span className="text-2xl md:text-3xl font-bold text-amber-700">
            Iman Café
          </span>
        </div>


        <ul className="hidden md:flex gap-8 text-gray-700 font-medium">
          <Link to="/" className="hover:text-amber-600 cursor-pointer transition-colors">Home</Link>
          <Link to="/menu" className="hover:text-amber-600 cursor-pointer transition-colors">Menu</Link>
          <Link to="/dineIn" className="hover:text-amber-600 cursor-pointer transition-colors">Dine-IN</Link>
          <Link to="/Cart" className="hover:text-amber-600 cursor-pointer transition-colors">Cart</Link>
          <Link to="/contact" className="hover:text-amber-600 cursor-pointer transition-colors">Contact</Link>
        </ul>


<Link to="/customer/profile" className="hidden md:flex items-center gap-2 text-gray-700 cursor-pointer hover:text-amber-600 transition-colors">
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A7 7 0 1119.879 17.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
  <span className="font-medium">Profile</span>
</Link>


        <div className="md:hidden">
          <button className="text-amber-700 font-bold">Menu</button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;

