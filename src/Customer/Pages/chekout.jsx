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
  const [orderType, setOrderType] = useState(localStorage.getItem("checkoutOrderType") || "delivery");
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
        : `http://localhost:5000${image.startsWith("/uploads") ? image : "/uploads/" + image}`
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
        console.log(" Creating cash order...");

        const { data } = await api.post(
          "/orders",
          {
            items: orderItems,
            totalAmount: totalPrice,
            type: orderType,
            method: "cash",
          }
        );

        console.log(" Order placed successfully:", data.order);
        toast.success("Order placed successfully!");
        dispatch(clearCart());
        localStorage.removeItem("checkoutOrderType");
        setOrderType("delivery");
        setPaymentMethod("online");
        navigate("/menu");
      } else {
        // 💳 Razorpay Online Payment
        console.log(" Initializing Razorpay...");

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
            console.log(" Payment successful, verifying...");

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

              console.log("✅ Payment verified and order placed:", verifyRes.data.order);
              toast.success("Payment successful! Order placed.");
              dispatch(clearCart());
              localStorage.removeItem("checkoutOrderType");
              setOrderType("delivery");
              setPaymentMethod("online");
              navigate("/menu");
            } catch (err) {
              console.error(" Payment verification failed:", err);
              toast.error("Payment verification failed. Please contact support.");
            }
          },
          prefill: {
            name: JSON.parse(localStorage.getItem("customerData"))?.name || "",
            email: JSON.parse(localStorage.getItem("customerData"))?.email || "",
          },
          theme: { color: "#b45309" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();

        rzp.on("payment.failed", (response) => {
          console.error(" Razorpay Payment Failed:", response.error);
          toast.error("Payment failed. Please try again.");
        });
      }
    } catch (err) {
      console.error(" Error processing payment/order:", err);
      toast.error(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-100 p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-orange-700 mb-6">
            Checkout
          </h2>

          {/*  Cart Items */}
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id || item.id}
                className="flex justify-between items-center border-b border-gray-200 pb-2"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-800">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/*  Total */}
          <div className="mt-6 border-t border-gray-200 pt-4 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800">Total</h3>
            <h3 className="text-xl font-bold text-orange-700">
              ₹{totalPrice.toFixed(2)}
            </h3>
          </div>

          {/*  Payment Section */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center">
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="cash">Cash on Delivery / Pickup</option>
              <option value="online">Online Payment</option>
            </select>

            <button
              onClick={handlePayment}
              disabled={loading}
              className={`w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-xl transition-all ${loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
            >
              {loading
                ? "Processing..."
                : paymentMethod === "cash"
                  ? "Place Order"
                  : "Pay Online"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
