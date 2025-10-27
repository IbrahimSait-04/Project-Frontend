// ✅ src/pages/Staff/StaffHome.jsx

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import api from "../../services/api";
import {
  ClipboardList,
  CheckCircle,
  Clock,
  XCircle,
  LayoutDashboard,
  User,
  LogOut,
  ShoppingBag,
  DollarSign,
  Package,
  Utensils,
  Mail,
  Calendar,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const StaffHome = () => {
  const [reservations, setReservations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const token = localStorage.getItem("staffToken");
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resReservations, resOrders] = await Promise.all([
          api.get("/reservations", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/orders", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const fetchedReservations =
          resReservations.data.reservations || resReservations.data || [];
        const fetchedOrders = resOrders.data.orders || resOrders.data || [];

        setReservations(fetchedReservations);
        setOrders(fetchedOrders);

        console.log("✅ Reservations:", fetchedReservations);
        console.log("✅ Orders:", fetchedOrders);
      } catch (error) {
        console.error("❌ Failed to load data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // ✅ Logout staff
  const handleLogout = () => {
    localStorage.removeItem("staffToken");
    navigate("/login");
  };

  // ✅ Update Reservation Status
  const handleReservationStatus = async (id, status) => {
    try {
      await api.put(
        `/reservations/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReservations((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
      toast.success(`Reservation marked as ${status}`);
    } catch (error) {
      console.error("❌ Error updating reservation:", error);
      toast.error("Failed to update reservation status");
    }
  };

  // ✅ Update Order Status
  const handleOrderStatus = async (id, status) => {
    try {
      await api.put(
        `/orders/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status } : o))
      );
      toast.success(`Order marked as ${status}`);
    } catch (error) {
      console.error("❌ Error updating order:", error);
      toast.error("Failed to update order status");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-yellow-50">
        <p className="text-amber-700 text-lg font-semibold animate-pulse">
          Loading Staff Dashboard...
        </p>
      </div>
    );

  // ✅ Dashboard Stats
  const stats = {
    totalReservations: reservations.length,
    confirmed: reservations.filter((r) => r.status === "confirmed").length,
    pending: reservations.filter((r) => r.status === "pending").length,
    cancelled: reservations.filter((r) => r.status === "cancelled").length,

    totalOrders: orders.length,
    completedOrders: orders.filter((o) => o.status === "completed").length,
    pendingOrders: orders.filter((o) => o.status === "pending").length,
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col justify-between">
        <div>
          <div className="p-6 border-b border-yellow-100">
            <h1 className="text-2xl font-bold text-green-600">Staff Panel</h1>
          </div>

          <nav className="mt-6 space-y-2 px-4">
            <Link
              to="/staff/profile"
              className="flex items-center gap-3 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-xl hover:bg-yellow-200 transition"
            >
              <User size={20} /> Profile
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-yellow-100">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 rounded-xl transition-all duration-300"
          >
            <LogOut size={20} />
            Logout
          </button>

        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-yellow-800 mb-8 flex items-center gap-2">
          <LayoutDashboard size={30} /> Staff Dashboard
        </h1>

        {/* Reservation Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <DashboardCard
            icon={<ClipboardList className="text-yellow-500 w-10 h-10" />}
            title="Total Reservations"
            count={stats.totalReservations}
            borderColor="border-yellow-500"
          />
          <DashboardCard
            icon={<CheckCircle className="text-green-600 w-10 h-10" />}
            title="Confirmed"
            count={stats.confirmed}
            borderColor="border-green-500"
          />
          <DashboardCard
            icon={<Clock className="text-yellow-600 w-10 h-10" />}
            title="Pending"
            count={stats.pending}
            borderColor="border-yellow-400"
          />
          <DashboardCard
            icon={<XCircle className="text-red-600 w-10 h-10" />}
            title="Cancelled"
            count={stats.cancelled}
            borderColor="border-red-500"
          />
        </div>

        {/* Order Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <DashboardCard
            icon={<ShoppingBag className="text-yellow-600 w-10 h-10" />}
            title="Total Orders"
            count={stats.totalOrders}
            borderColor="border-yellow-600"
          />
          <DashboardCard
            icon={<CheckCircle className="text-green-600 w-10 h-10" />}
            title="Completed Orders"
            count={stats.completedOrders}
            borderColor="border-green-500"
          />
          <DashboardCard
            icon={<Clock className="text-yellow-600 w-10 h-10" />}
            title="Pending Orders"
            count={stats.pendingOrders}
            borderColor="border-yellow-400"
          />
        </div>

        {/* Tables */}
        <DataTable
          title="Dine-In Reservations"
          data={reservations}
          onRowClick={setSelectedReservation}
          onStatusChange={handleReservationStatus}
          columns={["Customer", "Date", "Time", "Guests", "Status"]}
        />

        <DataTable
          title="Customer Orders"
          data={orders}
          onRowClick={setSelectedOrder}
          onStatusChange={handleOrderStatus}
          columns={["Customer", "Total", "Type", "Method", "Status"]}
          isOrder
        />

        {selectedReservation && (
          <DetailPopup
            data={selectedReservation}
            onClose={() => setSelectedReservation(null)}
            type="Reservation"
          />
        )}

        {selectedOrder && (
          <DetailPopup
            data={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            type="Order"
          />
        )}
      </main>
    </div>
  );
};


const DashboardCard = ({ icon, title, count, borderColor }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`p-6 rounded-2xl shadow-md bg-white border-l-4 ${borderColor}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
        <p className="text-3xl font-bold text-yellow-700">{count}</p>
      </div>
      {icon}
    </div>
  </motion.div>
);

const DataTable = ({ title, data, onRowClick, onStatusChange, columns, isOrder }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.3 }}
    className="bg-white/90 shadow-2xl rounded-2xl border border-amber-200 overflow-hidden mb-10"
  >
    <div className="bg-yellow-600 text-white py-4 px-6 flex justify-between items-center">
      <h2 className="text-xl font-semibold">{title}</h2>
      <Clock className="w-6 h-6" />
    </div>

    <table className="w-full text-center">
      <thead className="bg-yellow-100 text-yellow-800 uppercase text-sm">
        <tr>
          {columns.map((col) => (
            <th key={col} className="py-3 px-4">{col}</th>
          ))}
          <th className="py-3 px-4">Action</th>
        </tr>
      </thead>

      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length + 1} className="py-6 text-gray-500">
              No records found
            </td>
          </tr>
        ) : (
          data.map((item, index) => (
            <motion.tr
              key={item._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-yellow-100 hover:bg-yellow-50 transition-all cursor-pointer"
              onClick={() => onRowClick(item)}
            >
              {isOrder ? (
                <>
                  <td className="py-3 px-4">{item.user?.name || "N/A"}</td>
                  <td className="py-3 px-4">₹{item.totalAmount}</td>
                  <td className="py-3 px-4">{item.type}</td>
                  <td className="py-3 px-4">{item.method}</td>
                </>
              ) : (
                <>
                  <td className="py-3 px-4">{item.user?.name || "N/A"}</td>
                  <td className="py-3 px-4">
                    {new Date(item.date).toLocaleDateString("en-GB")}
                  </td>
                  <td className="py-3 px-4">{item.time}</td>
                  <td className="py-3 px-4">{item.guests}</td>
                </>
              )}
              <td className="py-3 px-4 font-semibold">{item.status}</td>
              <td className="py-3 px-4">
                <select
                  value={item.status}
                  onChange={(e) => onStatusChange(item._id, e.target.value)}
                  className="border border-gray-300 text-sm rounded-lg p-2 focus:ring-yellow-400 focus:border-yellow-400"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
            </motion.tr>
          ))
        )}
      </tbody>
    </table>
  </motion.div>
);

const DetailPopup = ({ data, onClose, type }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    className="mt-10 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-yellow-200 p-6"
  >
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold text-yellow-800 flex items-center gap-2">
        <User /> {type} Details
      </h2>
      <button
        onClick={onClose}
        className="text-red-600 hover:text-red-700 font-semibold"
      >
        ✕ Close
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
      <DetailRow label="Customer" value={data.user?.name} />
      <DetailRow label="Email" value={data.user?.email} />
      {type === "Reservation" ? (
        <>
          <DetailRow label="Date" value={data.date} />
          <DetailRow label="Time" value={data.time} />
          <DetailRow label="Guests" value={data.guests} />
        </>
      ) : (
        <>
          <DetailRow label="Amount" value={`₹${data.totalAmount}`} />
          <DetailRow label="Type" value={data.type} />
          <DetailRow label="Method" value={data.method} />
        </>
      )}
      <DetailRow label="Status" value={data.status} />
    </div>
  </motion.div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex items-center gap-3 bg-yellow-50 rounded-lg p-3 shadow-sm">
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-base font-medium text-gray-800">{value}</p>
    </div>
  </div>
);

export default StaffHome;
