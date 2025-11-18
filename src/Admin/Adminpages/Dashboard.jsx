// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
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
  ShoppingBag,
  Mail,
  Phone,
  Calendar,
  Users,
  DollarSign,
  Utensils,
  ShoppingCart,
} from "lucide-react";

/* ----------------------------- Utils ----------------------------- */
const statusOf = (val) => String(val || "").toLowerCase();
const fmtDateTime = (d) => (d ? new Date(d).toLocaleString() : "N/A");
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB") : "N/A");
const fmtCurrency = (n) => `₹${Number(n ?? 0).toFixed(2)}`;

// next step pipeline for orders
const nextOrderStatus = (st) => {
  const s = statusOf(st);
  if (s === "pending") return "accepted";
  if (s === "accepted") return "preparing";
  if (s === "preparing") return "completed"; // "Completed" == handed to customer
  return null;
};
const humanNextLabel = (st) => {
  const s = statusOf(st);
  if (s === "pending") return "Accept Order";
  if (s === "accepted") return "Mark Preparing";
  if (s === "preparing") return "Handed to Customer (Complete)";
  return null;
};

/* ----------------------- Reusable UI bits ------------------------ */
const DashboardCard = ({ icon, title, count, borderColor }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
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

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 bg-yellow-50 rounded-lg p-3 shadow-sm">
    {React.cloneElement(icon, { className: "w-5 h-5 text-amber-700" })}
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-base font-medium text-gray-800">{value}</p>
    </div>
  </div>
);

/* -------------------------- Main Dashboard -------------------------- */
const Dashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedReservation, setSelectedReservation] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const token = localStorage.getItem("adminToken");
  const authHeader = { Authorization: `Bearer ${token}` };

  // derived groups
  const pendingReservations = useMemo(
    () => reservations.filter((r) => statusOf(r.status) === "pending"),
    [reservations]
  );
  const pendingOrders = useMemo(
    () => orders.filter((o) => statusOf(o.status) === "pending"),
    [orders]
  );
  const inProgressOrders = useMemo(
    () => orders.filter((o) => ["accepted", "preparing"].includes(statusOf(o.status))),
    [orders]
  );

  // revenue (completed orders only)
  const { dailyRevenue, monthlyRevenue } = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const d = now.getDate();

    let daily = 0;
    let monthly = 0;

    orders.forEach((o) => {
      if (statusOf(o.status) !== "completed") return;
      const created = new Date(o.createdAt || o.updatedAt || Date.now());
      if (created.getFullYear() === y && created.getMonth() === m) {
        monthly += Number(o.totalAmount || 0);
        if (created.getDate() === d) daily += Number(o.totalAmount || 0);
      }
    });

    return { dailyRevenue: daily, monthlyRevenue: monthly };
  }, [orders]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [resvResp, ordResp] = await Promise.all([
          api.get("/reservations", { headers: authHeader }),
          api.get("/orders", { headers: authHeader }),
        ]);

        const resvData = resvResp.data?.reservations || resvResp.data || [];
        const ordData = ordResp.data?.orders || ordResp.data || [];

        setReservations(resvData);
        setOrders(ordData);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // status updates
  const setReservationStatus = async (id, status) => {
    try {
      await api.put(`/reservations/${id}/status`, { status }, { headers: authHeader });
      setReservations((prev) => prev.map((r) => (r._id === id ? { ...r, status } : r)));
      setSelectedReservation((prev) => (prev?._id === id ? { ...prev, status } : prev));
      toast.success(`Reservation ${status}`);
    } catch (err) {
      console.error("updateReservationStatus:", err);
      toast.error("Failed to update reservation");
    }
  };

  const setOrderStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/orders/${id}/status`, { status }, { headers: authHeader });
      const updated = data?.order;
      setOrders((prev) => prev.map((o) => (o._id === id ? updated || { ...o, status } : o)));
      setSelectedOrder((prev) => (prev?._id === id ? updated || { ...prev, status } : prev));
      toast.success(`Order marked as ${status}`);
    } catch (err) {
      console.error("updateOrderStatus:", err);
      toast.error(err.response?.data?.message || "Status update failed");
    }
  };

  const advanceOrder = (order) => {
    const nxt = nextOrderStatus(order?.status);
    if (!nxt) return;
    setOrderStatus(order._id, nxt);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-amber-50">
        <p className="text-amber-700 font-semibold text-lg animate-pulse">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  // KPI stats
  const stats = {
    totalOrders: orders.length,
    pendingOrders: pendingOrders.length,
    totalReservations: reservations.length,
    pendingReservations: pendingReservations.length,
  };

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <h1 className="text-3xl font-bold text-amber-800 mb-6 flex items-center gap-2">
        <LayoutDashboard size={28} /> Admin Dashboard
      </h1>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
        <DashboardCard
          icon={<ShoppingCart className="text-yellow-600 w-10 h-10" />}
          title="Total Orders"
          count={stats.totalOrders}
          borderColor="border-yellow-600"
        />
        <DashboardCard
          icon={<Calendar className="text-green-600 w-10 h-10" />}
          title="Total Reservations"
          count={stats.totalReservations}
          borderColor="border-green-500"
        />
        <DashboardCard
          icon={<Clock className="text-yellow-600 w-10 h-10" />}
          title="Pending Orders"
          count={stats.pendingOrders}
          borderColor="border-yellow-400"
        />
        <DashboardCard
          icon={<Clock className="text-red-600 w-10 h-10" />}
          title="Pending Reservations"
          count={stats.pendingReservations}
          borderColor="border-red-500"
        />
        <DashboardCard
          icon={<DollarSign className="text-emerald-600 w-10 h-10" />}
          title="Revenue (Today)"
          count={fmtCurrency(dailyRevenue)}
          borderColor="border-emerald-500"
        />
        <DashboardCard
          icon={<DollarSign className="text-indigo-600 w-10 h-10" />}
          title="Revenue (Month)"
          count={fmtCurrency(monthlyRevenue)}
          borderColor="border-indigo-500"
        />
      </div>

      {/* Pending Sections with Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Pending Orders */}
        <div className="bg-white shadow-xl rounded-2xl border p-5 border-amber-200">
          <h2 className="text-xl font-bold text-amber-800 mb-3">
            🍽 Pending Orders ({stats.pendingOrders})
          </h2>

          {!pendingOrders.length ? (
            <p className="text-gray-600 bg-green-100 text-center p-3 rounded-lg">
              No pending orders
            </p>
          ) : (
            pendingOrders.map((order) => (
              <div key={order._id} className="border rounded-xl p-4 mb-4 bg-white">
                <p className="font-bold text-amber-700">Order #{String(order._id).slice(-6)}</p>
                <p>
                  <Clock className="inline mr-1 size-4" /> {fmtDateTime(order.createdAt)}
                </p>
                <p>
                  <User className="inline mr-1 size-4" /> {order.user?.name || "Walk-in"}
                </p>
                <p>
                  <b>Total:</b> {fmtCurrency(order.totalAmount)}
                </p>

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => setOrderStatus(order._id, "accepted")}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-xl text-sm"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => setOrderStatus(order._id, "cancelled")}
                    className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded-xl text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl text-amber-700 text-sm"
                  >
                    View
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pending Reservations */}
        <div className="bg-white shadow-xl rounded-2xl border p-5 border-green-200">
          <h2 className="text-xl font-bold text-green-700 mb-3">
            📅 Pending Reservations ({stats.pendingReservations})
          </h2>

          {!pendingReservations.length ? (
            <p className="text-gray-600 bg-green-100 text-center p-3 rounded-lg">
              No pending reservations
            </p>
          ) : (
            pendingReservations.map((res) => (
              <div key={res._id} className="border rounded-xl p-4 mb-4 bg-white">
                <p className="font-bold text-green-700">
                  Reservation #{String(res._id).slice(-6)}
                </p>
                <p>
                  <User className="inline mr-1 size-4" /> {res.user?.name || "Guest"}
                </p>
                <p>
                  <Calendar className="inline mr-1 size-4" /> {fmtDate(res.date)}
                </p>
                <p>
                  <Clock className="inline mr-1 size-4" /> {res.time}
                </p>

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => setReservationStatus(res._id, "confirmed")}
                    className="bg-green-600 text-white px-3 py-1 rounded-xl text-sm"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => setReservationStatus(res._id, "cancelled")}
                    className="bg-red-100 text-red-600 px-3 py-1 rounded-xl text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setSelectedReservation(res)}
                    className="border px-3 py-1 rounded-xl text-green-700 text-sm"
                  >
                    View
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* In-Progress Orders (step-by-step action button) */}
      {inProgressOrders.length > 0 && (
        <div className="bg-white shadow-xl rounded-2xl border p-5 border-amber-200 mb-10">
          <h2 className="text-xl font-bold text-amber-800 mb-3">
            🔧 In-Progress Orders ({inProgressOrders.length})
          </h2>
          {inProgressOrders.map((o) => (
            <div key={o._id} className="border rounded-xl p-4 mb-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-amber-700">
                    Order #{String(o._id).slice(-6)} — {o.user?.name || "Walk-in"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status: <b className="capitalize">{statusOf(o.status)}</b> • Total:{" "}
                    {fmtCurrency(o.totalAmount)}
                  </p>
                </div>
                <div className="flex gap-2">
                  {nextOrderStatus(o.status) && (
                    <button
                      onClick={() => advanceOrder(o)}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-xl text-sm"
                    >
                      {humanNextLabel(o.status)}
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedOrder(o)}
                    className="border border-amber-200 text-amber-700 px-3 py-1 rounded-xl text-sm"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* All Tables (no actions; click to open modal) */}
      <div className="grid grid-cols-1 gap-8">
        <DataTableNoAction
          title="Dine-In Reservations (Click for Details)"
          data={reservations}
          columns={["Customer", "Date", "Time", "Guests"]}
          isOrder={false}
          onRowClick={setSelectedReservation}
        />

        <DataTableNoAction
          title="Customer Orders (Click for Details)"
          data={orders}
          columns={["Customer", "Total", "Type", "Method"]}
          isOrder={true}
          onRowClick={setSelectedOrder}
        />
      </div>

      {/* Popups */}
      {selectedOrder && (
        <OrderDetailPopup
          data={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onAdvance={() => advanceOrder(selectedOrder)}
          onCancel={() => setOrderStatus(selectedOrder._id, "cancelled")}
        />
      )}
      {selectedReservation && (
        <ReservationDetailPopup
          data={selectedReservation}
          onClose={() => setSelectedReservation(null)}
          onAccept={() => setReservationStatus(selectedReservation._id, "confirmed")}
          onCancel={() => setReservationStatus(selectedReservation._id, "cancelled")}
        />
      )}
    </div>
  );
};

/* -------------------- Tables (read-only rows) -------------------- */
const DataTableNoAction = ({ title, data, columns, isOrder, onRowClick }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.15 }}
    className="bg-white/90 shadow-2xl rounded-2xl border border-amber-200 overflow-hidden"
  >
    <div className="bg-yellow-600 text-white py-4 px-6 flex justify-between items-center">
      <h2 className="text-xl font-semibold">{title}</h2>
      <Clock className="w-6 h-6" />
    </div>

    <table className="w-full text-center">
      <thead className="bg-yellow-100 text-yellow-800 uppercase text-sm">
        <tr>
          {columns.map((c) => (
            <th key={c} className="py-3 px-4">
              {c}
            </th>
          ))}
          <th className="py-3 px-4">Status</th>
        </tr>
      </thead>
      <tbody>
        {!data?.length ? (
          <tr>
            <td colSpan={columns.length + 1} className="py-6 text-gray-500">
              No records found
            </td>
          </tr>
        ) : (
          data.map((item, idx) => (
            <motion.tr
              key={item._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="border-b border-yellow-100 hover:bg-yellow-50 transition-all cursor-pointer"
              onClick={() => onRowClick(item)}
            >
              {isOrder ? (
                <>
                  <td className="py-3 px-4 text-left font-semibold">
                    {item?.user?.name || "N/A"}
                  </td>
                  <td className="py-3 px-4">{fmtCurrency(item?.totalAmount)}</td>
                  <td className="py-3 px-4">{item?.type || "N/A"}</td>
                  <td className="py-3 px-4">{item?.method || "N/A"}</td>
                </>
              ) : (
                <>
                  <td className="py-3 px-4 text-left font-semibold">
                    {item?.user?.name || "N/A"}
                  </td>
                  <td className="py-3 px-4">{fmtDate(item?.date)}</td>
                  <td className="py-3 px-4">{item?.time || "N/A"}</td>
                  <td className="py-3 px-4">{item?.guests ?? "N/A"}</td>
                </>
              )}
              <td
                className={`py-3 px-4 font-semibold ${
                  ["confirmed", "completed"].includes(statusOf(item?.status))
                    ? "text-green-600"
                    : statusOf(item?.status) === "cancelled"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {item?.status || "pending"}
              </td>
            </motion.tr>
          ))
        )}
      </tbody>
    </table>
  </motion.div>
);

/* --------------------------- Detail Popups --------------------------- */
const ReservationDetailPopup = ({ data, onClose, onAccept, onCancel }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
    <motion.div
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-green-200 p-6 w-full max-w-2xl"
    >
      <div className="flex justify-between items-center mb-4 border-b pb-3">
        <h2 className="text-xl font-bold text-green-700 flex items-center gap-2">
          <Calendar /> Reservation #{String(data?._id).slice(-6)}
        </h2>
        <button onClick={onClose} className="text-red-600 font-semibold">✕ Close</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <DetailRow icon={<User />} label="Customer" value={data?.user?.name || "Guest"} />
        <DetailRow icon={<Mail />} label="Email" value={data?.user?.email || "N/A"} />
        <DetailRow icon={<Phone />} label="Phone" value={data?.user?.phone || "N/A"} />
        <DetailRow icon={<Utensils />} label="Status" value={data?.status || "N/A"} />
        <DetailRow icon={<Calendar />} label="Date" value={fmtDate(data?.date)} />
        <DetailRow icon={<Clock />} label="Time" value={data?.time || "N/A"} />
        <DetailRow icon={<Users />} label="Guests" value={data?.guests ?? "N/A"} />
        <DetailRow icon={<ClipboardList />} label="Special Request" value={data?.notes || "None"} />
      </div>

      {statusOf(data?.status) === "pending" && (
        <div className="flex gap-3 mt-6">
          <button onClick={onAccept} className="bg-green-600 text-white px-3 py-2 rounded-xl text-sm">Accept</button>
          <button onClick={onCancel} className="bg-red-100 text-red-600 px-3 py-2 rounded-xl text-sm">Cancel</button>
        </div>
      )}
    </motion.div>
  </div>
);

const OrderDetailPopup = ({ data, onClose, onAdvance, onCancel }) => {
  const items =
    data?.items?.map((it) => ({
      name: it?.product?.name ?? it?.name ?? "Item",
      quantity: it?.quantity ?? 1,
      price: it?.product?.price ?? it?.price ?? 0,
    })) ?? [];

  const nextLbl = humanNextLabel(data?.status);
  const canAdvance = Boolean(nextOrderStatus(data?.status));

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-amber-200 p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h2 className="text-xl font-bold text-amber-800 flex items-center gap-2">
            <ShoppingBag /> Order #{String(data?._id).slice(-6)}
          </h2>
          <button onClick={onClose} className="text-red-600 font-semibold">✕ Close</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <DetailRow icon={<User />} label="Customer" value={data?.user?.name || "Walk-in"} />
          <DetailRow icon={<Mail />} label="Email" value={data?.user?.email || "N/A"} />
          <DetailRow icon={<Phone />} label="Phone" value={data?.user?.phone || "N/A"} />
          <DetailRow icon={<Utensils />} label="Status" value={data?.status || "N/A"} />
          <DetailRow icon={<DollarSign />} label="Total Amount" value={fmtCurrency(data?.totalAmount)} />
          <DetailRow icon={<ShoppingBag />} label="Order Type" value={data?.type || "N/A"} />

          {/* NEW: show exact order date/time */}
          <DetailRow
            icon={<Calendar />}
            label="Ordered At"
            value={fmtDateTime(data?.createdAt || data?.updatedAt || data?.orderAt)}
          />
        </div>

        <div className="mt-4 space-y-2 bg-yellow-50 p-4 rounded-lg shadow-inner border border-yellow-200">
          <h3 className="text-lg font-bold text-amber-700 flex items-center gap-2">
            <ClipboardList /> Items ({items.length})
          </h3>
          {items.length ? (
            <ul className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {items.map((it, i) => (
                <li
                  key={i}
                  className="flex justify-between text-sm py-1 border-b border-yellow-100 last:border-b-0"
                >
                  <span className="font-medium text-gray-800">
                    {it.name} <span className="text-gray-500">x{it.quantity}</span>
                  </span>
                  <span className="font-semibold text-amber-700">
                    {fmtCurrency((it.price ?? 0) * (it.quantity ?? 1))}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No items found.</p>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          {canAdvance && (
            <button
              onClick={onAdvance}
              className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-xl text-sm"
            >
              {nextLbl}
            </button>
          )}
          {statusOf(data?.status) !== "completed" &&
            statusOf(data?.status) !== "cancelled" && (
              <button
                onClick={onCancel}
                className="bg-red-100 text-red-600 px-3 py-2 rounded-xl text-sm"
              >
                Cancel Order
              </button>
            )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
