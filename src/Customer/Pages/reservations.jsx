import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../Components/Navbar.jsx";
import Footer from "../Components/Footer.jsx";
import api from "../../services/api.js";

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem("customerToken");
        if (!token) {
          toast.error("Please log in as a customer to view your reservations");
          return;
        }

        const response = await api.get("/reservations/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setReservations(response.data);
      } catch (error) {
        console.error("Failed to fetch reservations:", error.response?.data || error.message);
        toast.error("Failed to fetch your reservations");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="min-h-screen bg-gray-100 py-12 px-6">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-center text-amber-700 mb-10">
            My Reservations
          </h1>

          {loading ? (
            <p className="text-center text-gray-500">Loading your reservations...</p>
          ) : reservations.length === 0 ? (
            <p className="text-center text-gray-600">No reservations found.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {reservations.map((res) => (
                <div
                  key={res._id}
                  className="border border-gray-200 rounded-2xl shadow-md p-6 bg-gray-50 hover:shadow-lg transition"
                >
                  <h2 className="text-xl font-semibold text-amber-800 mb-2">
                    Date: {new Date(res.date).toLocaleDateString()}
                  </h2>
                  <p className="text-gray-700">
                    <strong>Time:</strong> {res.time}
                  </p>
                  <p className="text-gray-700">
                    <strong>Guests:</strong> {res.partySize}
                  </p>
                  <p
                    className={`font-semibold mt-2 ${
                      res.status === "confirmed"
                        ? "text-green-600"
                        : res.status === "cancelled"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    Status: {res.status || "Pending"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyReservations;
