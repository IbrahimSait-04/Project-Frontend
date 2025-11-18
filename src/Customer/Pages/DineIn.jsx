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

   console.log(" Reservation Success:", response.data);
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
        " Reservation failed:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Reservation failed");
    }
  };

  return (
    <div>
      <Navbar />

      <div
        className="min-h-screen bg-cover bg-center relative flex flex-col items-center justify-center px-4"
        style={{
          backgroundImage:
            'url("https://www.thedailymeal.com/img/gallery/the-menu-rule-youre-supposed-to-follow-at-fine-dining-restaurants/l-intro-1670362698.jpg")',
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 w-full max-w-3xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-10">
            Reserve Your Table
          </h1>

          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 md:p-16">
            {success && (
              <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-xl text-center font-semibold">
                Reservation submitted successfully!
              </div>
            )}

            <h2 className="text-3xl font-bold text-amber-700 mb-6 text-center">
              Book a Table
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  type="number"
                  name="guests"
                  placeholder="Number of Guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition bg-gray-50"
                  min={1}
                  max={10}
                  required
                />

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition bg-gray-50"
                  required
                />

                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition bg-gray-50"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-amber-700 text-white font-bold rounded-xl hover:bg-amber-800 transition shadow-lg"
              >
                Reserve Now
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DineInReservation;
