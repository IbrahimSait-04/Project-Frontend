import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import api from "../../services/api";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", description: "" });
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    setFile(f || null);
    setFileName(f ? f.name : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      alert("Please enter your name and email.");
      return;
    }

    try {
      let screenshotUrl = "";
      if (file) {
        const fd = new FormData();
        fd.append("image", file);

        const uploadRes = await api.post("/upload/image", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (uploadRes.data?.success) {
          screenshotUrl = uploadRes.data.imageUrl;
        }
      }

      await api.post("/support/contact", {
        name: form.name,
        email: form.email,
        description: form.description,
        screenshotUrl,
      });

      alert("Thanks! Your message was submitted.");
      setForm({ name: "", email: "", description: "" });
      setFile(null);
      setFileName("");
    } catch (err) {
      console.error("Error submitting contact form:", err?.response?.data || err);
      alert("Failed to submit. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <Navbar />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-sm sm:text-base uppercase tracking-[0.25em] text-amber-600 mb-2">
              Get in touch
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">
              We&apos;d love to hear from you
            </h1>
            <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Have a question, feedback, or special request? Send us a message
              and we&apos;ll get back to you as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">
            <div className="order-2 lg:order-1 bg-white/70 backdrop-blur-md rounded-2xl shadow-md border border-amber-100 p-5 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-amber-800 mb-4">
                Visit or contact Iman Café
              </h2>
              <ul className="space-y-3 text-sm sm:text-base text-gray-700">
                <li>
                  <span className="font-semibold text-gray-900">Address:</span>{" "}
                  123 Café Street, Kollam, Kerala
                </li>
                <li>
                  <span className="font-semibold text-gray-900">Phone:</span>{" "}
                  +91 12345 67890
                </li>
                <li>
                  <span className="font-semibold text-gray-900">Email:</span>{" "}
                  hello@imancafe.com
                </li>
                <li className="pt-2 border-t border-amber-100 mt-2">
                  <span className="font-semibold text-gray-900">
                    Opening Hours:
                  </span>
                  <br />
                  Mon – Sun: 10:00 AM – 11:00 PM
                </li>
              </ul>
              <p className="mt-4 text-xs sm:text-sm text-gray-500">
                Tip: You can also attach a screenshot of your issue or
                reservation detail for faster support.
              </p>
            </div>

            {/* Form column */}
            <div className="order-1 lg:order-2">
              <div className="bg-white shadow-xl rounded-2xl p-5 sm:p-7 lg:p-8 border border-amber-100">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5">
                  Contact Form
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div className="space-y-1">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700"
                    >
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      type="text"
                      placeholder="Your Name"
                      className="w-full px-4 py-2.5 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="file"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Upload Screenshot (optional)
                    </label>
                    <input
                      id="file"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                    />
                    {fileName && (
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Selected: {fileName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="description"
                      className="text-sm font-medium text-gray-700"
                    >
                      Message
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Tell us how we can help you..."
                      rows="4"
                      className="w-full px-4 py-2.5 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl text-sm sm:text-base font-semibold shadow-md hover:from-amber-700 hover:to-orange-700 transition-all active:scale-[0.98]"
                  >
                    Submit Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
