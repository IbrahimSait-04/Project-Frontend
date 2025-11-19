import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../../redux/cartSlice";
import { toast } from "react-toastify";
import api from "../../services/api.js";
import Navbar from "../Components/Navbar.jsx";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const [orderType, setOrderType] = useState(
    localStorage.getItem("checkoutOrderType") || "delivery"
  );
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [loading, setLoading] = useState(false);

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

  const handlePayment = async () => {
    const token =
      localStorage.getItem("customerToken") ||
      localStorage.getItem("staffToken") ||
      localStorage.getItem("adminToken");

    const userId =
      localStorage.getItem("customerId") ||
      localStorage.getItem("staffId") ||
      localStorage.getItem("adminId");

    if (!token || !userId) {
      toast.error("You must be logged in to proceed.");
      navigate("/login");
      return;
    }

    if (!cartItems.length) {
      toast.error("Your cart is empty.");
      return;
    }

    const orderItems = cartItems.map((item) => ({
      product: item._id || item.id,
      quantity: item.quantity || 1,
    }));

    try {
      setLoading(true);

      if (paymentMethod === "cash") {
        console.log("Creating cash order...");

        const { data } = await api.post("/orders", {
          items: orderItems,
          totalAmount: totalPrice,
          type: orderType,
          method: "cash",
        });

        console.log("Order placed successfully:", data.order);
        toast.success("Order placed successfully!");
        dispatch(clearCart());
        localStorage.removeItem("checkoutOrderType");
        setOrderType("delivery");
        setPaymentMethod("online");
        navigate("/menu");
      } else {
        // Razorpay Online Payment
        console.log("Initializing Razorpay...");

        const { data } = await api.post("/payment", {
          totalAmount: totalPrice,
          method: "online",
        });

        const options = {
          key: data.key,
          amount: data.amount,
          currency: data.currency,
          name: "Iman Café",
          description: "Order Payment",
          order_id: data.orderId,
          handler: async (response) => {
            console.log("Payment successful, verifying...");

            try {
              const verifyRes = await api.post(
                "/payment/verify",
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  userId,
                  items: orderItems,
                  totalAmount: totalPrice,
                  type: orderType,
                  method: "online",
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );

              console.log(
                "✅ Payment verified and order placed:",
                verifyRes.data.order
              );
              toast.success("Payment successful! Order placed.");
              dispatch(clearCart());
              localStorage.removeItem("checkoutOrderType");
              setOrderType("delivery");
              setPaymentMethod("online");
              navigate("/menu");
            } catch (err) {
              console.error("Payment verification failed:", err);
              toast.error(
                "Payment verification failed. Please contact support."
              );
            }
          },
          prefill: {
            name:
              JSON.parse(localStorage.getItem("customerData"))?.name || "",
            email:
              JSON.parse(localStorage.getItem("customerData"))?.email || "",
          },
          theme: { color: "#b45309" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();

        rzp.on("payment.failed", (response) => {
          console.error("Razorpay Payment Failed:", response.error);
          toast.error("Payment failed. Please try again.");
        });
      }
    } catch (err) {
      console.error("Error processing payment/order:", err);
      toast.error(
        err.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-100">
      <Navbar />

      <div className="flex-1 p-4 sm:p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-5 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-orange-700 mb-6">
            Checkout
          </h2>

          {/* Empty cart state */}
          {!cartItems.length ? (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">
                Your cart is empty. Add some items to continue.
              </p>
              <button
                onClick={() => navigate("/menu")}
                className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-5 rounded-xl text-sm sm:text-base"
              >
                Go to Menu
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-3 sm:space-y-4 max-h-72 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div
                    key={item._id || item.id}
                    className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-gray-200 pb-3"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-gray-800 text-sm sm:text-base">
                          {item.name}
                        </p>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-800 text-sm sm:text-base text-right">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Total & Order Type (read-only info) */}
              <div className="mt-6 border-t border-gray-200 pt-4 flex flex-col sm:flex-row justify-between gap-3 sm:items-center">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                    Total
                  </h3>
                  <h3 className="text-lg sm:text-xl font-bold text-orange-700">
                    ₹{totalPrice.toFixed(2)}
                  </h3>
                </div>
                <div className="text-sm text-gray-500 text-right sm:text-left">
                  <p>
                    <span className="font-semibold text-gray-700">
                      Order Type:
                    </span>{" "}
                    <span className="capitalize">{orderType}</span>
                  </p>
                </div>
              </div>

              {/* Payment Section */}
              <div className="mt-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm sm:text-base"
                >
                  <option value="cash">Cash on Delivery / Pickup</option>
                  <option value="online">Online Payment</option>
                </select>

                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className={`w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-xl text-sm sm:text-base transition-all ${
                    loading ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {loading
                    ? "Processing..."
                    : paymentMethod === "cash"
                    ? "Place Order"
                    : "Pay Online"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
