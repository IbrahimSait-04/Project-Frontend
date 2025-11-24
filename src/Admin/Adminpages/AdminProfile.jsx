import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Admin",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchAdminProfile = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast.warn("No authentication token found. Please log in.");
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      const { data } = await api.get("/admin/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const profileData = data;
      setAdmin(profileData);
      setFormData({
        name: profileData.name || "",
        email: profileData.email || "",
        role: profileData.role || "Admin",
      });
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Profile fetch error:", error);
      toast.error(
        error.response?.data?.message ||
          "Could not connect to the API to load profile."
      );
      setAdmin(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!isAuthenticated) {
      toast.error("You must be authenticated to update the profile.");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast.error("Authentication token missing. Cannot update.");
        setIsLoading(false);
        return;
      }

      const updatePayload = {
        name: formData.name,
        email: formData.email,
      };

      const { data } = await api.put("/admin/profile", updatePayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(data.message || "Profile updated successfully!");
      setIsEditing(false);
      await fetchAdminProfile();
    } catch (error) {
      console.error("API Update Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to save changes."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] bg-gray-50 rounded-2xl p-4">
        <div className="text-xl font-medium text-amber-800 animate-pulse">
          Loading profile...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-[400px] bg-red-50 rounded-2xl p-4">
        <div className="text-xl font-medium text-red-700">
          Not Authenticated. Please log in.
        </div>
      </div>
    );
  }

  if (!admin && !isEditing) {
    return (
      <div className="flex justify-center items-center min-h-[400px] bg-white rounded-2xl p-4">
        <div className="text-lg text-gray-500 text-center">
          No profile data found. This may indicate a new user.
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 block mx-auto bg-amber-500 hover:bg-amber-600 text-white py-2 px-6 rounded-lg font-bold transition duration-200 shadow-md"
          >
            Initialize Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start w-full bg-gray-100 p-4 sm:p-6 rounded-2xl min-h-[400px]">
      <div className="bg-white shadow-2xl rounded-3xl p-6 sm:p-8 w-full max-w-lg border border-amber-100">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-amber-900 mb-8 tracking-tight">
          Admin Profile
        </h2>

        <div className="flex justify-center mb-6">
          <div className="bg-amber-100 text-amber-700 text-3xl sm:text-4xl p-5 sm:p-6 rounded-full font-bold w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shadow-inner ring-4 ring-amber-200">
            {admin?.name ? admin.name[0].toUpperCase() : "A"}
          </div>
        </div>

        {!isEditing ? (
          <>
            <div className="space-y-4 sm:space-y-6 text-sm sm:text-base">
              <div className="p-3 sm:p-4 bg-gray-50 rounded-xl flex justify-between items-center shadow-inner">
                <strong className="text-gray-600 font-semibold">Role:</strong>
                <span className="text-gray-800 font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs sm:text-sm">
                  {admin?.role || "Admin"}
                </span>
              </div>

              <div className="p-3 sm:p-4 bg-gray-50 rounded-xl flex justify-between items-center shadow-inner">
                <strong className="text-gray-600 font-semibold">Name:</strong>
                <span className="text-gray-800">{admin?.name || "N/A"}</span>
              </div>

              <div className="p-3 sm:p-4 bg-gray-50 rounded-xl flex justify-between items-center shadow-inner">
                <strong className="text-gray-600 font-semibold">Email:</strong>
                <span className="text-gray-800 break-all">
                  {admin?.email || "N/A"}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                if (admin)
                  setFormData({
                    name: admin.name,
                    email: admin.email,
                    role: admin.role,
                  });
                setIsEditing(true);
              }}
              className="w-full mt-8 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl font-bold transition duration-200 shadow-lg hover:shadow-xl disabled:bg-gray-400 text-sm sm:text-base"
              disabled={isLoading}
            >
              Edit Profile
            </button>
          </>
        ) : (
          <>
            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
              <label className="block text-gray-700 font-semibold">
                Role
              </label>
              <input
                type="text"
                value={formData.role}
                className="w-full border-2 border-gray-200 bg-gray-100 p-2.5 sm:p-3 rounded-xl outline-none text-sm sm:text-base"
                disabled
              />

              <label className="block text-gray-700 font-semibold pt-2">
                Name
              </label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full border-2 border-amber-200 p-2.5 sm:p-3 rounded-xl focus:ring-2 ring-amber-300 outline-none transition duration-150 text-sm sm:text-base"
                disabled={isLoading}
              />

              <label className="block text-gray-700 font-semibold pt-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border-2 border-amber-200 p-2.5 sm:p-3 rounded-xl focus:ring-2 ring-amber-300 outline-none transition duration-150 text-sm sm:text-base"
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
              <button
                onClick={handleUpdate}
                className="w-full sm:w-1/2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition duration-200 shadow-md hover:shadow-lg disabled:bg-gray-400 text-sm sm:text-base"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => {
                  if (admin)
                    setFormData({
                      name: admin.name,
                      email: admin.email,
                      role: admin.role,
                    });
                  setIsEditing(false);
                }}
                className="w-full sm:w-1/2 bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-xl font-bold transition duration-200 shadow-md hover:shadow-lg disabled:bg-gray-400 text-sm sm:text-base"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
