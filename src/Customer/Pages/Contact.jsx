import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      alert("Please enter your name and email.");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("description", form.description);
    if (file) formData.append("file", file);

    console.log("Submitting contact form (demo):", {
      name: form.name,
      email: form.email,
      description: form.description,
      fileName,
    });

    alert(" Thanks! Your message was submitted (check console).");

    setForm({ name: "", email: "", description: "" });
    setFile(null);
    setFileName("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-amber-200">
      <Navbar />

      <div className="flex flex-1 justify-center items-center p-6">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
          <h2 className="text-3xl font-bold text-center mb-6">Contact Us</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-400"
              required
            />

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-400"
              required
            />

            <div>
              <label
                htmlFor="file"
                className="block mb-2 text-gray-600 font-medium"
              >
                Upload Screenshot (optional)
              </label>
              <input
                id="file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-400"
              />
              {fileName && (
                <p className="text-sm text-gray-500 mt-1">{fileName}</p>
              )}
            </div>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              rows="4"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-400"
            />

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
