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
        : `https://project-backend-qqbo.onrender.com${
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
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1 bg-gradient-to-br from-orange-50 via-amber-100 to-yellow-50 py-8 sm:py-10 px-3 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="backdrop-blur-xl bg-white/75 rounded-3xl shadow-2xl p-5 sm:p-8"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-amber-800 mb-6 sm:mb-10">
              Your Cart
            </h2>

            {cartItems.length === 0 ? (
              <p className="text-center text-gray-500 py-8 sm:py-10 text-base sm:text-lg">
                Your cart is empty
              </p>
            ) : (
              <>
                {/* Cart items */}
                <div className="space-y-4 sm:space-y-6">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.01 }}
                      className="w-full flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white shadow-md rounded-2xl border border-gray-200 p-4 sm:p-5 transition"
                    >
                      <div className="flex w-full sm:w-auto items-center gap-4">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl object-cover border border-gray-300 flex-shrink-0"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-base sm:text-lg text-amber-800">
                            {item.name}
                          </h3>
                          <p className="text-gray-600 text-sm sm:text-base">
                            ₹{item.price}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => handleDecrement(item)}
                              className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300 transition text-lg"
                            >
                              -
                            </button>
                            <span className="px-2 text-sm sm:text-base">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleIncrement(item)}
                              className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300 transition text-lg"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Summary + order type */}
                <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-6">
                  <div className="flex gap-3 sm:gap-4 w-full sm:w-auto justify-center">
                    <button
                      onClick={() => setOrderType("delivery")}
                      className={`flex-1 sm:flex-none px-5 sm:px-6 py-2 rounded-xl text-sm sm:text-base font-semibold transition-all ${
                        orderType === "delivery"
                          ? "bg-green-500 text-white shadow-md scale-[1.03]"
                          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      }`}
                    >
                      Delivery
                    </button>
                    <button
                      onClick={() => setOrderType("pickup")}
                      className={`flex-1 sm:flex-none px-5 sm:px-6 py-2 rounded-xl text-sm sm:text-base font-semibold transition-all ${
                        orderType === "pickup"
                          ? "bg-blue-500 text-white shadow-md scale-[1.03]"
                          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      }`}
                    >
                      Pick Up
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 items-center sm:items-end justify-center sm:justify-end w-full sm:w-auto">
                    <span className="text-sm text-gray-500">
                      Total Amount
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold text-amber-800">
                      ₹{totalPrice.toFixed(2)}
                    </h3>
                  </div>
                </div>

                {/* Checkout button */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCheckout}
                  disabled={!cartItems.length}
                  className={`w-full mt-8 bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-white font-bold py-3 sm:py-4 rounded-2xl text-sm sm:text-base transition-all shadow-lg ${
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
