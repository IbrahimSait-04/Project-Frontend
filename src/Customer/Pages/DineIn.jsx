import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../Components/Navbar.jsx";
import Footer from "../Components/Footer.jsx";
import api from "../../services/api.js";

const DineInReservation = () => {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    guests: 1,
  });

  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("customerToken");
    if (!token) {
      toast.error("Please log in as a customer to make a reservation");
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("customerToken");

      if (!token) {
        toast.error("Customer not logged in! Please log in.");
        return;
      }

      const response = await api.post(
        "/reservations",
        {
          date: formData.date,
          time: formData.time,
          partySize: formData.guests,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Reservation Success:", response.data);
      toast.success("Reservation submitted successfully!");
      setSuccess(true);

      setFormData({
        date: "",
        time: "",
        guests: 1,
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error(
        "Reservation failed:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Reservation failed");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        <div
          className="min-h-[calc(100vh-80px)] bg-cover bg-center relative flex flex-col items-center justify-center px-4 py-10 sm:py-14"
          style={{
            backgroundImage:
              'url("https://www.thedailymeal.com/img/gallery/the-menu-rule-youre-supposed-to-follow-at-fine-dining-restaurants/l-intro-1670362698.jpg")',
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/60"></div>

          <div className="relative z-10 w-full max-w-3xl text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 sm:mb-8 drop-shadow-lg">
              Reserve Your Table
            </h1>
            <p className="text-sm sm:text-base text-gray-100 mb-6 sm:mb-8 max-w-xl mx-auto">
              Plan your perfect dine-in experience at Iman Café. Choose your
              date, time, and number of guests — we&apos;ll handle the rest.
            </p>

            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10">
              {success && (
                <div className="mb-6 p-3 sm:p-4 bg-green-100 text-green-800 rounded-xl text-center font-semibold text-sm sm:text-base">
                  Reservation submitted successfully!
                </div>
              )}

              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-700 mb-6 text-center">
                Book a Table
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="guests"
                      className="text-sm font-medium text-gray-700 text-left"
                    >
                      Number of Guests
                    </label>
                    <input
                      id="guests"
                      type="number"
                      name="guests"
                      placeholder="Number of Guests"
                      value={formData.guests}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition bg-gray-50 text-sm sm:text-base"
                      min={1}
                      max={10}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="date"
                      className="text-sm font-medium text-gray-700 text-left"
                    >
                      Date
                    </label>
                    <input
                      id="date"
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition bg-gray-50 text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="time"
                      className="text-sm font-medium text-gray-700 text-left"
                    >
                      Time
                    </label>
                    <input
                      id="time"
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition bg-gray-50 text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-3 py-3.5 sm:py-4 bg-gradient-to-r from-amber-600 to-orange-700 text-white font-bold rounded-2xl hover:from-amber-700 hover:to-orange-800 transition-all shadow-lg active:scale-[0.98] text-sm sm:text-base"
                >
                  Reserve Now
                </button>

                <p className="mt-3 text-xs sm:text-sm text-gray-500">
                  You&apos;ll receive a confirmation once our staff reviews your
                  reservation request.
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DineInReservation;
