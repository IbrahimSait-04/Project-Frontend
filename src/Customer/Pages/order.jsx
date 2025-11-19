import React, { useEffect, useState, useMemo } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Utensils,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* -------- Modal -------- */
const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all border-t-4 border-orange-500">
        <div className="p-5 sm:p-6">
          <h3 className="text-xl sm:text-2xl font-bold text-orange-700 mb-3 sm:mb-4 flex items-center">
            <Utensils className="mr-2" /> Order Details
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-4">
            Order ID:{" "}
            <span className="font-mono text-gray-700">
              {order._id.slice(-8)}
            </span>
          </p>

          <div className="space-y-2 mb-5 sm:mb-6 text-sm sm:text-base">
            <p>
              <strong>Type:</strong>{" "}
              {order.type
                ? order.type.charAt(0).toUpperCase() + order.type.slice(1)
                : "N/A"}
            </p>
            <p>
              <strong>Payment:</strong>{" "}
              {order.method
                ? order.method.charAt(0).toUpperCase() + order.method.slice(1)
                : "N/A"}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 border-b pb-1">
            Items ({order.items?.length || 0})
          </h4>
          <ul className="space-y-3">
            {order.items?.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
              >
                <span className="font-medium text-gray-700">
                  {item.product?.name || "Unknown Item"}
                </span>
                <span className="text-gray-600">
                  {item.quantity} x ₹{item.product?.price || "0.00"}
                </span>
              </li>
            ))}
            {(!order.items || order.items.length === 0) && (
              <li className="text-gray-500 text-center py-2 text-sm">
                No items listed.
              </li>
            )}
          </ul>

          <div className="mt-5 sm:mt-6 pt-4 border-t border-orange-200">
            <p className="text-lg sm:text-xl font-bold text-orange-600 flex justify-between items-center">
              Total Amount:{" "}
              <span className="text-xl sm:text-2xl">
                ₹{order.totalAmount?.toFixed(2) || "0.00"}
              </span>
            </p>
          </div>
        </div>
        <div className="px-5 sm:px-6 pb-5 sm:pb-6">
          <button
            onClick={onClose}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 rounded-lg text-sm sm:text-base transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* -------- Page -------- */
const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderFilter, setOrderFilter] = useState("current");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const token = localStorage.getItem("customerToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.error("Please login to view orders");
      navigate("/login");
      return;
    }
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const CURRENT_STATUSES = useMemo(() => ["pending", "confirmed"], []);
  const PAST_STATUSES = useMemo(() => ["completed", "cancelled"], []);

  const isPastOrder = (order) => {
    const status = order.status ? order.status.toLowerCase() : "";
    return PAST_STATUSES.includes(status);
  };

  const handleViewDetails = (order) => {
    if (isPastOrder(order)) {
      toast.info("Order details are restricted for past transactions.");
      setSelectedOrder(null);
    } else {
      setSelectedOrder(order);
    }
  };

  const getStatusStyles = (status) => {
    const lowerStatus = (status || "").toLowerCase();
    switch (lowerStatus) {
      case "pending":
        return "text-yellow-700 bg-yellow-100 border border-yellow-300";
      case "confirmed":
        return "text-blue-700 bg-blue-100 border border-blue-300";
      case "completed":
        return "text-green-700 bg-green-100 border border-green-300";
      case "cancelled":
        return "text-red-700 bg-red-100 border border-red-300";
      default:
        return "text-gray-700 bg-gray-100 border border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    const lowerStatus = (status || "").toLowerCase();
    switch (lowerStatus) {
      case "pending":
        return <Clock size={16} className="text-yellow-600" />;
      case "confirmed":
        return <Package size={16} className="text-blue-600" />;
      case "completed":
        return <CheckCircle size={16} className="text-green-600" />;
      case "cancelled":
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <Clock size={16} />;
    }
  };

  const formattedStatus = (status) => {
    if (!status) return "Unknown";
    const s = status.toLowerCase();
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const status = order.status ? order.status.toLowerCase() : "";
      if (orderFilter === "current") {
        return CURRENT_STATUSES.includes(status);
      } else {
        return PAST_STATUSES.includes(status);
      }
    });
  }, [orders, orderFilter, CURRENT_STATUSES, PAST_STATUSES]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-extrabold text-orange-700 mb-4 md:mb-6 flex items-center gap-2">
          🍽️ My Orders
        </h1>

        <div className="bg-white shadow-2xl rounded-2xl p-4 sm:p-5 md:p-6 border border-orange-200">
          {/* Filter buttons */}
          <div className="flex flex-wrap gap-2 md:gap-3 mb-4 border-b pb-3">
            <button
              onClick={() => setOrderFilter("current")}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition ${
                orderFilter === "current"
                  ? "bg-orange-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-orange-50"
              }`}
            >
              Current Orders
            </button>
            <button
              onClick={() => setOrderFilter("past")}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition ${
                orderFilter === "past"
                  ? "bg-orange-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-orange-50"
              }`}
            >
              Past Orders
            </button>
          </div>

          <h2 className="text-base md:text-xl font-semibold text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
            {orderFilter === "current"
              ? "⏳ Orders In Progress"
              : "✅ Completed & Cancelled Orders"}
          </h2>

          {/* Loading */}
          {loading && (
            <p className="text-center py-6 text-orange-700 font-medium text-sm sm:text-base">
              Loading your orders...
            </p>
          )}

          {/* Header row (desktop only) */}
          {!loading && filteredOrders.length > 0 && (
            <div className="hidden md:grid grid-cols-6 font-semibold text-sm text-orange-700 bg-amber-100 px-4 py-2 rounded-md mt-3">
              <span>ID</span>
              <span>Date</span>
              <span>Items</span>
              <span>Total</span>
              <span className="text-center">Status</span>
              <span className="text-center">Details</span>
            </div>
          )}

          {/* Empty states */}
          {!loading && filteredOrders.length === 0 && (
            <p className="text-gray-600 text-center py-6 text-sm sm:text-base">
              {orderFilter === "current"
                ? "🎉 All caught up! No active orders right now."
                : "😕 No past orders found. Start your first order!"}
            </p>
          )}

          {/* Orders list */}
          {!loading &&
            filteredOrders.map((order) => {
              const isPast = isPastOrder(order);

              return (
                <div
                  key={order._id}
                  className="mt-2 bg-white hover:bg-amber-50 rounded-lg shadow-sm border border-gray-100 transition duration-150 p-3 sm:p-4 flex flex-col gap-2 md:grid md:grid-cols-6 md:items-center"
                >
                  {/* ID */}
                  <span className="truncate font-medium text-xs sm:text-sm">
                    #{order._id.slice(-6)}
                  </span>

                  {/* Date (hidden on very small screens) */}
                  <span className="text-xs sm:text-sm text-gray-600 hidden md:inline">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>

                  {/* Items */}
                  <span className="text-xs sm:text-sm text-gray-700">
                    {order.items?.length || 0} items
                  </span>

                  {/* Total */}
                  <span className="font-bold text-green-700 text-xs sm:text-sm">
                    ₹{order.totalAmount?.toFixed(2) || "0.00"}
                  </span>

                  {/* Status */}
                  <span
                    className={`flex items-center gap-1 justify-start md:justify-center text-[11px] sm:text-xs md:text-sm px-3 py-1 rounded-full font-medium w-fit md:w-auto ${getStatusStyles(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    {formattedStatus(order.status)}
                  </span>

                  {/* Details button */}
                  <div className="flex md:justify-center">
                    <button
                      onClick={() => handleViewDetails(order)}
                      className={`flex justify-center items-center transition ${
                        isPast
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-orange-500 hover:text-orange-700"
                      }`}
                      disabled={isPast}
                      aria-label={`View details for order ${order._id.slice(
                        -6
                      )}`}
                    >
                      <Info size={18} />
                    </button>
                  </div>

                  {/* Extra small-screen date (stacked) */}
                  <span className="text-[11px] text-gray-500 md:hidden">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      {selectedOrder && !isPastOrder(selectedOrder) && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default CustomerOrders;
