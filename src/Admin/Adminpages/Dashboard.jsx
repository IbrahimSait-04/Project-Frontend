import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import api from "../../services/api";
import {
  CheckCircle,
  XCircle,
  Clock,
  Utensils,
  User,
  Mail,
  Phone,
  Calendar,
  Users,
} from "lucide-react";

const AdminDashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const { data } = await api.get("/reservations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReservations(data);
      } catch (err) {
        console.error("Error fetching reservations:", err);
        toast.error("Failed to fetch reservations");
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, [token]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.put(`/reservations/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReservations((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
      );

      toast.success(`Reservation marked as ${newStatus}`);
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-amber-700 text-lg font-semibold animate-pulse">
          Loading reservations...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-10"
        >
          <h1 className="text-3xl font-bold text-amber-800">
            🍽️ Admin Dashboard
          </h1>
          <div className="text-gray-700 font-medium">
            Total Reservations:{" "}
            <span className="text-amber-700 font-semibold">
              {reservations.length}
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <DashboardCard
            icon={<Clock className="text-yellow-500" size={28} />}
            title="Pending"
            count={reservations.filter((r) => r.status === "pending").length}
          />
          <DashboardCard
            icon={<CheckCircle className="text-green-600" size={28} />}
            title="Confirmed"
            count={reservations.filter((r) => r.status === "confirmed").length}
          />
          <DashboardCard
            icon={<XCircle className="text-red-600" size={28} />}
            title="Cancelled"
            count={reservations.filter((r) => r.status === "cancelled").length}
          />
        </div>

        {/* Table Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden border border-amber-200"
        >
          <table className="w-full text-center">
            <thead className="bg-amber-600 text-white text-sm uppercase tracking-wide">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Guests</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res, index) => (
                <motion.tr
                  key={res._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-amber-100 hover:bg-amber-50 transition-all cursor-pointer"
                  onClick={() => setSelectedReservation(res)}
                >
                  <td className="py-3 px-4">
                    {res.user?.name
                      ? res.user.name.charAt(0).toUpperCase() + res.user.name.slice(1)
                      : "N/A"}
                  </td>

                  <td className="py-3 px-4 text-gray-600">
                    {res.user?.email}
                  </td>
                  <td className="py-3 px-4">{new Date(res.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                  </td>
                  <td className="py-3 px-4">{res.time}</td>
                  <td className="py-3 px-4">{res.guests}</td>
                  <td
                    className={`py-3 px-4 font-semibold ${res.status === "confirmed"
                      ? "text-green-600"
                      : res.status === "cancelled"
                        ? "text-red-600"
                        : "text-yellow-600"
                      }`}
                  >
                    {res.status}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={res.status}
                      onChange={(e) =>
                        handleStatusUpdate(res._id, e.target.value)
                      }
                      className="border border-gray-300 text-sm rounded-lg p-2 focus:ring-amber-400 focus:border-amber-400"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Customer Details Panel */}
        {selectedReservation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-amber-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-amber-800 flex items-center gap-2">
                <User /> Customer Details
              </h2>
              <button
                onClick={() => setSelectedReservation(null)}
                className="text-red-600 hover:text-red-700 font-semibold"
              >
                Close ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
              <DetailRow icon={<User />} label="Name" value={selectedReservation.user?.name} />
              <DetailRow icon={<Mail />} label="Email" value={selectedReservation.user?.email} />
              <DetailRow icon={<Phone />} label="Phone" value={selectedReservation.user?.phone || "N/A"} />
              <DetailRow icon={<Calendar />} label="Date" value={selectedReservation.date} />
              <DetailRow icon={<Utensils />} label="Time" value={selectedReservation.time} />
              <DetailRow icon={<Users />} label="Guests" value={selectedReservation.guests} />
              <DetailRow icon={<Clock />} label="Status" value={selectedReservation.status} />
              <DetailRow icon={<Utensils />} label="Special Request" value={selectedReservation.notes || "None"} />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const DashboardCard = ({ icon, title, count }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="bg-white/90 backdrop-blur-md shadow-lg rounded-xl p-6 border border-amber-100 flex items-center justify-between"
  >
    <div className="flex items-center gap-3">
      {icon}
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <span className="text-2xl font-bold text-amber-700">{count}</span>
  </motion.div>
);

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 bg-amber-50 rounded-lg p-3 shadow-sm">
    {icon}
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-base font-medium text-gray-800">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;
