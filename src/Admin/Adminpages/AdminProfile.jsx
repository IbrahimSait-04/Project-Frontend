import React, { useEffect, useState } from "react";

// --- API Configuration ---
const API_BASE_URL = "/api/admin";

// Mocking toast notifications for console logging
const toast = {
    success: (msg) => console.log(`SUCCESS: ${msg}`),
    error: (msg) => console.error(`ERROR: ${msg}`),
    warn: (msg) => console.warn(`WARN: ${msg}`),
};
// -------------------------

const AdminProfile = () => {
    const [admin, setAdmin] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        // The role is assumed to be "admin" and non-editable
        role: "Admin"
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    /**
     * Function to fetch the admin profile from the backend, using the token
     * from localStorage and handling potential non-JSON responses gracefully.
     */
    const fetchAdminProfile = async () => {
        setIsLoading(true);
        try {
            // Get token from localStorage as requested
            const token = localStorage.getItem("adminToken"); 
            
            if (!token) {
                toast.warn("No authentication token found. Please log in.");
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            }

            const response = await fetch(`${API_BASE_URL}/profile`, {
                method: 'GET',
                headers: {
                    // Pass the token in the Authorization header
                    'Authorization': `Bearer ${token}`, 
                },
            });

            // 1. Check if response is not OK (e.g., 401, 404, 500)
            if (!response.ok) {
                // Try to parse the error message as JSON first
                let errorData;
                let errorMessage = `API Error (${response.status} ${response.statusText}): Unknown issue.`;

                try {
                    // Attempt to parse the body as JSON (expected format for errors)
                    errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    // If parsing fails (meaning it's HTML or plain text error, fixing the SyntaxError)
                    errorMessage = `API Error (${response.status} ${response.statusText}): Received non-JSON error response. Check network/server console.`;
                    // Log the raw body for debugging
                    console.error("Non-JSON Response Body:", await response.text());
                }

                throw new Error(errorMessage);
            }

            // 2. If response is OK, parse the success payload (expected to be JSON)
            const data = await response.json();
            
            // The backend returns { admin: { id, name, email, role } }
            const profileData = data.admin;
            setAdmin(profileData);
            setFormData({
                name: profileData.name || "",
                email: profileData.email || "",
                role: profileData.role || "Admin"
            });
            setIsAuthenticated(true);

        } catch (error) {
            console.error("Profile fetch error:", error);
            toast.error(error.message || "Could not connect to the API to load profile.");
            setAdmin(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    // 1. Initial Data Fetch on Component Mount
    useEffect(() => {
        fetchAdminProfile();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    /**
     * Handle update (Saves to Backend)
     */
    const handleUpdate = async () => {
        if (!isAuthenticated) {
            toast.error("You must be authenticated to update the profile.");
            return;
        }

        setIsLoading(true);
        try {
            // Get token from localStorage for update request
            const token = localStorage.getItem("adminToken"); 
             if (!token) {
                toast.error("Authentication token missing. Cannot update.");
                setIsLoading(false);
                return;
            }

            // Prepare payload (only send fields that can be updated)
            const updatePayload = {
                name: formData.name,
                email: formData.email,
            };

            const response = await fetch(`${API_BASE_URL}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Pass token
                },
                body: JSON.stringify(updatePayload),
            });

            // Check for non-OK response before parsing JSON
            if (!response.ok) {
                let errorData;
                let errorMessage = `API Error (${response.status} ${response.statusText}): Unknown issue.`;

                try {
                    errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    errorMessage = `API Error (${response.status} ${response.statusText}): Received non-JSON error response on update.`;
                    console.error("Non-JSON Update Response Body:", await response.text());
                }

                throw new Error(errorMessage);
            }

            const data = await response.json();

            toast.success(data.message || "Profile updated successfully!");
            setIsEditing(false);
            // Re-fetch profile to ensure UI reflects the latest data
            await fetchAdminProfile(); 

        } catch (error) {
            console.error("API Update Error:", error);
            toast.error(error.message || "Failed to save changes.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[400px] bg-gray-50 rounded-2xl p-4">
                <div className="text-xl font-medium text-amber-800 animate-pulse">Loading profile...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="flex justify-center items-center h-full min-h-[400px] bg-red-50 rounded-2xl p-4">
                <div className="text-xl font-medium text-red-700">Not Authenticated. Please log in.</div>
            </div>
        );
    }

    if (!admin && !isEditing) {
        return (
            <div className="flex justify-center items-center h-full min-h-[400px] bg-white rounded-2xl p-4">
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
        <div className="flex justify-center items-start w-full bg-gray-100 p-6 min-h-screen">
            <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-lg border border-amber-100">

                <h2 className="text-4xl font-extrabold text-center text-amber-900 mb-10 tracking-tight">
                    Admin Profile
                </h2>
                <div className="flex justify-center mb-8">
                    {/* Profile initial avatar */}
                    <div className="bg-amber-100 text-amber-700 text-4xl p-6 rounded-full font-bold w-20 h-20 flex items-center justify-center shadow-inner ring-4 ring-amber-200">
                        {admin?.name ? admin.name[0].toUpperCase() : 'A'}
                    </div>
                </div>

                {/* View Mode */}
                {!isEditing ? (
                    <>
                        <div className="space-y-6 text-lg">
                            {/* Role Display */}
                            <div className="p-4 bg-gray-50 rounded-xl flex justify-between items-center shadow-inner">
                                <strong className="text-gray-600 font-semibold">Role:</strong>
                                <span className="text-gray-800 font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">{admin?.role || "Admin"}</span>
                            </div>
                            {/* Name Display */}
                            <div className="p-4 bg-gray-50 rounded-xl flex justify-between items-center shadow-inner">
                                <strong className="text-gray-600 font-semibold">Name:</strong>
                                <span className="text-gray-800">{admin?.name || "N/A"}</span>
                            </div>
                            {/* Email Display */}
                            <div className="p-4 bg-gray-50 rounded-xl flex justify-between items-center shadow-inner">
                                <strong className="text-gray-600 font-semibold">Email:</strong>
                                <span className="text-gray-800">{admin?.email || "N/A"}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                // Set initial form data before editing
                                if (admin) setFormData({ name: admin.name, email: admin.email, role: admin.role });
                                setIsEditing(true);
                            }}
                            className="w-full mt-10 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl font-bold transition duration-200 shadow-lg hover:shadow-xl disabled:bg-gray-400"
                            disabled={isLoading}
                        >
                            Edit Profile
                        </button>
                    </>
                ) : (
                    /* Edit Mode */
                    <>
                        <div className="space-y-4">
                            {/* Role field (Display only for clarity) */}
                            <label className="block text-gray-700 font-semibold">
                                Role
                            </label>
                            <input
                                type="text"
                                value={formData.role}
                                className="w-full border-2 border-gray-200 bg-gray-100 p-3 rounded-xl outline-none"
                                disabled={true}
                            />

                            <label className="block text-gray-700 font-semibold pt-2">
                                Name
                            </label>
                            <input
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border-2 border-amber-200 p-3 rounded-xl focus:ring-2 ring-amber-300 outline-none transition duration-150"
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
                                className="w-full border-2 border-amber-200 p-3 rounded-xl focus:ring-2 ring-amber-300 outline-none transition duration-150"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={handleUpdate}
                                className="w-1/2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition duration-200 shadow-md hover:shadow-lg disabled:bg-gray-400"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                onClick={() => {
                                    // Revert changes on cancel
                                    if (admin) setFormData({ name: admin.name, email: admin.email, role: admin.role });
                                    setIsEditing(false);
                                }}
                                className="w-1/2 bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-xl font-bold transition duration-200 shadow-md hover:shadow-lg disabled:bg-gray-400"
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
