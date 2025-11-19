import React, { useState } from "react";
import api from "../../services/api";

const CreateMenuItem = () => {
  const [menuItem, setMenuItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setMenuItem((prev) => ({
      ...prev,
      [name]: name === "image" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(menuItem).forEach(([k, v]) => v && fd.append(k, v));

      const token = localStorage.getItem("adminToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await api.post("/menu/create", fd, { headers });
      console.log("Menu Item Created:", res.data);

      setSuccess(true);
      setMenuItem({ name: "", description: "", price: "", category: "", image: null });
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error("Error creating menu item:", err?.response?.data || err?.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 flex justify-center items-start py-10 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition">

        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-6">
          🍽 Create New Menu Item
        </h2>

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-xl text-center font-semibold">
            Menu Item Created Successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input
              name="name"
              value={menuItem.name}
              onChange={handleChange}
              placeholder="Dish Name"
              className="p-3 rounded-lg border bg-gray-50 focus:ring-2 focus:ring-amber-500"
              required
            />

            <input
              name="price"
              type="number"
              value={menuItem.price}
              onChange={handleChange}
              placeholder="Price ₹"
              className="p-3 rounded-lg border bg-gray-50 focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <textarea
            name="description"
            value={menuItem.description}
            onChange={handleChange}
            placeholder="Description"
            rows="3"
            className="w-full p-3 rounded-lg border bg-gray-50 focus:ring-2 focus:ring-amber-500"
            required
          />

          <select
            name="category"
            value={menuItem.category}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border bg-gray-50 focus:ring-2 focus:ring-amber-500"
            required
          >
            <option value="">Select Category</option>
            <option value="Chinese">Chinese</option>
            <option value="Arabic">Arabic</option>
            <option value="Snacks">Snacks</option>
            <option value="Cold Beverages">Cold Beverages</option>
            <option value="Hot Beverages">Hot Beverages</option>
          </select>

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-3 rounded-lg border bg-gray-50 focus:ring-2 focus:ring-amber-500"
          />

          {menuItem.image && (
            <img
              src={URL.createObjectURL(menuItem.image)}
              alt="Preview"
              className="w-full h-48 object-cover rounded-xl shadow-md"
            />
          )}

          <button
            type="submit"
            className="w-full py-4 bg-amber-700 text-white font-bold rounded-xl hover:bg-amber-800 transition shadow-md"
          >
            Create Menu Item
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateMenuItem;
