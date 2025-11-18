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
    if (name === "image") {
      setMenuItem((prev) => ({ ...prev, image: files[0] }));
    } else {
      setMenuItem((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", menuItem.name);
      formData.append("description", menuItem.description);
      formData.append("price", menuItem.price);
      formData.append("category", menuItem.category);
      if (menuItem.image) formData.append("image", menuItem.image);

      const token = localStorage.getItem("adminToken");
      const headers = {
        "Content-Type": "multipart/form-data",
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const response = await api.post("/menu/create", formData, { headers });

      console.log("Menu Item Created:", response.data);
      setSuccess(true);

      setMenuItem({
        name: "",
        description: "",
        price: "",
        category: "",
        image: null,
      });

      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error("Error creating menu item:", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transition-shadow hover:shadow-2xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-6">
          🍽 Create New Menu Item
        </h2>

        {success && (
          <div className="mb-4 p-3 text-green-800 bg-green-100 rounded-xl text-center font-semibold">
            Menu Item Created Successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Dish Name</label>
            <input
              type="text"
              name="name"
              value={menuItem.name}
              onChange={handleChange}
              placeholder="Item Name"
              className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition bg-gray-50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={menuItem.description}
              onChange={handleChange}
              placeholder="Item Description"
              rows="3"
              className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition bg-gray-50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
            <input
              type="number"
              name="price"
              value={menuItem.price}
              onChange={handleChange}
              placeholder="Item Price"
              className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition bg-gray-50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select
              name="category"
              value={menuItem.category}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition bg-gray-50"
              required
            >
              <option value="">Select Category</option>
              <option value="Chinese">Chinese</option>
              <option value="Arabic">Arabic</option>
              <option value="Snacks">Snacks</option>
              <option value="Cold Beverages">Cold Beverages</option>
              <option value="Hot Beverages">Hot Beverages</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Image</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition bg-gray-50"
              accept="image/*"
            />
          </div>

          {menuItem.image && (
            <div className="mt-4">
              <img
                src={URL.createObjectURL(menuItem.image)}
                alt="Preview"
                className="w-full h-48 object-cover rounded-xl shadow-md"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold text-white bg-amber-700 hover:bg-amber-800 shadow-md transition"
          >
            Create Menu Item
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateMenuItem;
