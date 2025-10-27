import React, { useEffect, useState } from "react";
import api from "../../services/api.js";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

 
  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders");
      setOrders(response.data.orders);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);


  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}`, { status });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Orders</h1>

      {orders.length === 0 && <p>No orders found.</p>}

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="p-4 border rounded shadow flex flex-col sm:flex-row justify-between items-center"
          >
            <div>
              <p>
                <strong>Order ID:</strong> {order._id}
              </p>
              <p>
                <strong>User:</strong> {order.user}
              </p>
              <p>
                <strong>Total Amount:</strong> ₹{order.totalAmount}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="capitalize">{order.status}</span>
              </p>
            </div>

            <div className="flex gap-2 mt-4 sm:mt-0">
              {["confirmed", "preparing", "delivered"].map((status) => (
                <button
                  key={status}
                  onClick={() => updateStatus(order._id, status)}
                  className={`px-3 py-1 rounded text-white ${
                    status === "confirmed"
                      ? "bg-green-500 hover:bg-green-600"
                      : status === "preparing"
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
