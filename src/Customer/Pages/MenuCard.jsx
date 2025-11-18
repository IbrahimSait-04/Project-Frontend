import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import api from "../../services/api.js";
import Navbar from "../Components/Navbar.jsx";
import Footer from "../Components/Footer.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MenuCard = ({ image, title, price, description, onAddToCart, isLoggedIn }) => {
  const imageUrl = image
    ? image.startsWith("http")
      ? image
      : `http://localhost:5000${image.startsWith("/uploads") ? image : "/uploads/" + image}`
    : "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <div className="bg-white shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-transform duration-300 group">
      <div className="relative">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <div className="p-5 flex flex-col justify-between min-h-[150px]">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <p className="text-green-600 font-semibold mt-1 text-lg">₹{price}</p>
          <p className="text-gray-600 text-sm mt-2 line-clamp-3">{description}</p>
        </div>

        {isLoggedIn ? (
          <button
            onClick={onAddToCart}
            className="w-full mt-5 bg-orange-500 text-white py-2 rounded-xl font-semibold hover:bg-orange-600 transition"
          >
            Order Now
          </button>
        ) : (
          <button
            onClick={() => (window.location.href = "/login")}
            className="w-full mt-5 bg-gray-400 text-white py-2 rounded-xl font-semibold cursor-pointer transition flex items-center justify-center gap-2"
          >
            Login to Order
          </button>
        )}
      </div>
    </div>
  );
};

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useDispatch();

const checkLogin = () => {
  const token = localStorage.getItem("customerToken");
  const data = localStorage.getItem("customerData");
  setIsLoggedIn(!!token && !!data);
};

  useEffect(() => {
    checkLogin();
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await api.get("/menu");
        setMenuItems(response.data || []);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };
    fetchMenu();
  }, []);

  const handleAddToCart = (item) => {
    if (!isLoggedIn) return;
    dispatch(
      addToCart({
        id: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
      })
    );
    toast.success(`${item.name} added to cart successfully!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const categories = [...new Set(menuItems.map((item) => item.category))];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Our Menu</h2>

        {categories.map((category) => (
          <div key={category} className="mb-12">
            <h2 className="text-3xl font-semibold text-orange-600 mb-6">{category}</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {menuItems
                .filter((item) => item.category === category)
                .map((item) => (
                  <MenuCard
                    key={item._id}
                    title={item.name}
                    price={item.price}
                    description={item.description}
                    image={item.image}
                    isLoggedIn={isLoggedIn}
                    onAddToCart={() => handleAddToCart(item)}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Menu;
