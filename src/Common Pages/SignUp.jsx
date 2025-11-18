import React, { useState } from "react";
import cafeLogo from "../assets/Iman Cafe Logo.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaFacebookF, FaInstagram, FaTwitter, FaPhone, FaEnvelope } from "react-icons/fa";
import api from "../services/api";

const SignUp = () => {

    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [phone, setPhone] = useState()
    const [password, setPassword] = useState()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
        api.post("/customer", { name, email, phone, password })
            .then(result => {
                console.log("User Created : ", result.data);
                navigate('/login');
            })
            .catch(error => {
                console.log("Signup error", error);
            });
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-amber-200 flex flex-col">

            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
                <img
                    src={cafeLogo}
                    alt="Iman Cafe Logo"
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover shadow-lg"
                />
                <span className="text-2xl md:text-3xl font-bold text-amber-700">Iman Café</span>
            </div>

            <div className="flex justify-center flex-1 px-4">
                <div className="max-w-screen-lg w-full flex flex-col md:flex-row rounded-xl overflow-hidden shadow-xl">

                    <div className="w-full md:w-1/2 relative h-64 md:h-auto">
                        <img
                            src={cafeLogo} 
                            alt="Delicious Meal"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-white/90 shadow-lg rounded-xl">
                        <div className="text-center mb-6">
                            <h1 className="text-4xl font-bold text-amber-800">Iman Café</h1>
                            <p className="text-lg text-gray-600 mt-2">Join us and enjoy delicious meals!</p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <input
                                type="text"
                                placeholder="Full Name"
                                required
                                className="p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                onChange={(e) => setName(e.target.value)}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                className="p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="tel"
                                placeholder="Phone"
                                maxLength={10}
                                pattern="[0-9]{10}"
                                required
                                className="p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                onChange={(e) => setPhone(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                className="p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-all shadow-md mt-4"
                            >
                                Sign Up
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-gray-600">
                            <p>
                                Already have an account?{" "}
                                <Link to="/login" className="text-amber-700 font-medium cursor-pointer hover:underline">
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t-2 border-amber-400 shadow-inner mt-6">
                <div className="max-w-7xl mx-auto px-4 py-6 grid md:grid-cols-3 gap-6">

                    {/* Logo & About */}
                    <div className="flex flex-col items-start gap-2">
                        <img
                            src={cafeLogo}
                            alt="Iman Cafe Logo"
                            className="w-16 h-16 rounded-full object-cover shadow-sm"
                        />
                        <h2 className="text-xl font-bold text-amber-700">Iman Café</h2>
                        <p className="text-gray-600 text-xs">
                            Experience the taste of tradition with a modern twist. Come dine with us and enjoy a cozy ambiance.
                        </p>
                        <div className="flex gap-2 mt-1 text-amber-700">
                            <a href="#"><FaFacebookF className="hover:text-amber-900 transition-colors text-sm" /></a>
                            <a href="#"><FaInstagram className="hover:text-amber-900 transition-colors text-sm" /></a>
                            <a href="#"><FaTwitter className="hover:text-amber-900 transition-colors text-sm" /></a>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col gap-1 text-gray-700 text-xs">
                        <h3 className="text-lg font-semibold text-amber-700 mb-1">Contact Us</h3>
                        <p className="flex items-center gap-1"><FaPhone className="text-sm" /> +91 12345 67890</p>
                        <p className="flex items-center gap-1"><FaEnvelope className="text-sm" /> info@imancafe.com</p>
                        <p className="text-xs">123 Cafe Street, Kollam, Kerala</p>
                    </div>

                </div>
            </footer>

        </div>
    );
};

export default SignUp;
