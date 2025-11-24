import React, { useState, useEffect } from "react";
import api from "../../services/api";         
import { toast } from "react-toastify";

const GetStaffs = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("adminToken");

        if (!token) {
          toast.error("Admin not logged in");
          setStaffList([]);
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await api.get("/admin/staff", config);

        const raw = res.data;
        const staff = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.staff)
          ? raw.staff
          : Array.isArray(raw?.staffs)
          ? raw.staffs
          : [];

        setStaffList(staff);
      } catch (err) {
        console.error(err);
        toast.error(err?.response?.data?.message || "Failed to fetch staff");
        setStaffList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading staff list...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 p-8 flex justify-center items-start">
      <div className="max-w-5xl w-full bg-white/80 backdrop-blur-lg border border-amber-200 rounded-3xl shadow-2xl p-10">
        <h2 className="text-3xl font-bold text-center text-amber-700 mb-8 tracking-tight">
          Current Staff Members
        </h2>

        {staffList.length === 0 ? (
          <p className="text-gray-500 text-center italic">No staff members found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {staffList.map((staff) => (
              <div
                key={staff._id || staff.id}
                className="p-5 rounded-2xl border border-amber-100 bg-white hover:bg-amber-50 shadow-md transition-transform hover:scale-[1.02]"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-lg text-gray-800">{staff.name}</p>
                    <p className="text-gray-500 text-sm">{staff.email || "-"}</p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                      staff.role === "chef"
                        ? "bg-red-100 text-red-700"
                        : staff.role === "waiter"
                        ? "bg-green-100 text-green-700"
                        : staff.role === "delivery boy"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {staff.role || "employee"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GetStaffs;
