import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../Components/Navbar.jsx";
import Footer from "../Components/Footer.jsx";
import api from "../../services/api.js";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("customerToken");
        const userData = localStorage.getItem("userData");

        if (!token || !userData) {
          toast.error("Please log in as a customer to view your orders");
          setLoading(false);
          return;
        }

        const user = JSON.parse(userData);
        if (!user || !user._id) {
          toast.error("Invalid user data");
          setLoading(false);
          return;
        }

        const response = await api.get("/orders/my-orders", {
          headers: { Authorization: `Bearer ${localStorage.getItem("customerToken")}` },
        });
        setOrders(response.data.orders || []);

      } catch (error) {
        console.error("Failed to fetch orders:", error.response?.data || error.message);
        toast.error("Failed to fetch your orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // 🧩 Group orders
  const activeOrders = orders.filter(
    (order) => order.status === "pending" || order.status === "confirmed"
  );
  const completedOrders = orders.filter((order) => order.status === "completed");

  return (
    <div>
      <Navbar />

      <div className="min-h-screen bg-gray-100 py-12 px-6">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-center text-amber-700 mb-10">
            My Orders
          </h1>

          {loading ? (
            <p className="text-center text-gray-500">Loading your orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-center text-gray-600">No orders found.</p>
          ) : (
            <>
              {/* 🟡 Active Orders */}
              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
                  Active Orders
                </h2>
                {activeOrders.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {activeOrders.map((order) => (
                      <div
                        key={order._id}
                        className="border border-gray-200 rounded-2xl shadow-md p-6 bg-yellow-50 hover:shadow-lg transition"
                      >
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                          Order #{order._id.slice(-5)}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                        <p className="text-gray-700 mt-2">
                          <strong>Status:</strong> {order.status}
                        </p>
                        <p className="text-gray-700">
                          <strong>Type:</strong> {order.type}
                        </p>
                        <p className="text-gray-700">
                          <strong>Payment:</strong> {order.method}
                        </p>
                        <p className="text-gray-700">
                          <strong>Total:</strong> ₹{order.totalAmount}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No active orders found.</p>
                )}
              </section>

              {/* 🟢 Completed Orders */}
              <section>
                <h2 className="text-2xl font-semibold text-green-600 mb-4">
                  Past Orders
                </h2>
                {completedOrders.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {completedOrders.map((order) => (
                      <div
                        key={order._id}
                        className="border border-gray-200 rounded-2xl shadow-md p-6 bg-green-50 hover:shadow-lg transition"
                      >
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                          Order #{order._id.slice(-5)}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                        <p className="text-gray-700 mt-2">
                          <strong>Status:</strong> {order.status}
                        </p>
                        <p className="text-gray-700">
                          <strong>Type:</strong> {order.type}
                        </p>
                        <p className="text-gray-700">
                          <strong>Payment:</strong> {order.method}
                        </p>
                        <p className="text-gray-700">
                          <strong>Total:</strong> ₹{order.totalAmount}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No past orders found.</p>
                )}
              </section>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Order;
