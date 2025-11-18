import { useSelector, useDispatch } from "react-redux";
import { updateQuantity, removeFromCart } from "../../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const [orderType, setOrderType] = useState(
    localStorage.getItem("checkoutOrderType") || "delivery"
  );

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const getImageUrl = (image) =>
    image
      ? image.startsWith("http")
        ? image
        : `http://localhost:5000${
            image.startsWith("/uploads") ? image : "/uploads/" + image
          }`
      : "";


  const handleIncrement = (item) => {
    dispatch(updateQuantity({ id: item.id, type: "inc" }));
  };

  const handleDecrement = (item) => {
    if (item.quantity === 1) {
      dispatch(removeFromCart(item.id));
      toast.info(`${item.name} removed from cart`);
    } else {
      dispatch(updateQuantity({ id: item.id, type: "dec" }));
    }
  };

  const handleCheckout = () => {
    if (!cartItems.length) {
      toast.error("Your cart is empty");
      return;
    }
    localStorage.setItem("checkoutOrderType", orderType);
    navigate("/checkout");
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-100 to-yellow-50 py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl p-8"
          >
            <h2 className="text-4xl font-extrabold text-center text-amber-800 mb-10">
               Your Cart
            </h2>

            {cartItems.length === 0 ? (
              <p className="text-center text-gray-500 py-10 text-lg">
                Your cart is empty
              </p>
            ) : (
              <>
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      className="flex flex-col sm:flex-row justify-between items-center bg-white shadow-md rounded-2xl border border-gray-200 p-5 transition"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="w-28 h-28 rounded-2xl object-cover border border-gray-300"
                        />
                        <div>
                          <h3 className="font-semibold text-lg text-amber-800">
                            {item.name}
                          </h3>
                          <p className="text-gray-600">₹{item.price}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => handleDecrement(item)}
                              className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                            >
                              -
                            </button>
                            <span className="px-2">{item.quantity}</span>
                            <button
                              onClick={() => handleIncrement(item)}
                              className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-10 flex flex-col sm:flex-row justify-between items-center gap-6">
                  <div className="flex gap-4">
                    <button
                      onClick={() => setOrderType("delivery")}
                      className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                        orderType === "delivery"
                          ? "bg-green-500 text-white shadow-md scale-105"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      Delivery
                    </button>
                    <button
                      onClick={() => setOrderType("pickup")}
                      className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                        orderType === "pickup"
                          ? "bg-blue-500 text-white shadow-md scale-105"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      Pick Up
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <h3 className="text-2xl font-bold text-amber-800">
                      Total: ₹{totalPrice.toFixed(2)}
                    </h3>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCheckout}
                  disabled={!cartItems.length}
                  className={`w-full mt-8 bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-white font-bold py-4 rounded-2xl transition-all shadow-lg ${
                    !cartItems.length ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  Checkout
                </motion.button>
              </>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
