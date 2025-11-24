import React, { useEffect, useState, useMemo } from "react";
import { Search, Mail, Users, User } from "lucide-react";
import api from "../../services/api";

const GetCustomers = () => {
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getCustomers = async () => {
      try {
        setLoading(true);
        setError(null);

        const adminToken = localStorage.getItem("adminToken");

        if (!adminToken) {
          setError("Admin not logged in");
          setCustomerList([]);
          return;
        }

        const config = { headers: { Authorization: `Bearer ${adminToken}` } };
        const response = await api.get("/admin/customer", config);

        const raw = response.data;

        const customers = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.customers)
          ? raw.customers
          : [];

        setCustomerList(customers);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError(err?.response?.data?.message || "Failed to fetch customers");
        setCustomerList([]);
      } finally {
        setLoading(false);
      }
    };

    getCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return customerList;

    return customerList.filter((customer) => {
      const nameMatch = customer.name
        ?.toLowerCase()
        .includes(term);
      const emailMatch = customer.email
        ?.toLowerCase()
        .includes(term);
      return nameMatch || emailMatch;
    });
  }, [customerList, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <p className="text-lg text-gray-700 font-medium">Loading customers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-amber-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Customer Directory
            </h1>
          </div>
          <p className="text-gray-600">
            Manage and view all your customers in one place
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Customer List */}
        {filteredCustomers.length > 0 && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="grid grid-cols-4 md:grid-cols-5 gap-4 bg-amber-100 px-6 py-3 text-sm font-semibold text-gray-700">
              <span>Name</span>
              <span className="col-span-2">Email</span>
              <span>Phone</span>
              <span className="hidden md:block">Joined</span>
            </div>

            <ul>
              {filteredCustomers.map((customer) => (
                <li
                  key={customer._id || customer.id}
                  className="grid grid-cols-4 md:grid-cols-5 gap-4 items-center px-6 py-4 border-b last:border-none hover:bg-amber-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center font-bold text-amber-700">
                      {customer.name?.charAt(0)?.toUpperCase() || "C"}
                    </div>
                    <span className="font-medium text-gray-800">
                      {customer.name || "Unnamed"}
                    </span>
                  </div>

                  <span className="col-span-2 text-gray-600 truncate flex items-center gap-2">
                    <Mail className="w-4 h-4 text-amber-500" />
                    {customer.email || "-"}
                  </span>

                  <span className="text-gray-600">
                    {customer.phone || "-"}
                  </span>

                  <span className="hidden md:block text-gray-500 text-sm">
                    {customer.createdAt
                      ? new Date(customer.createdAt).toLocaleDateString()
                      : "-"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {filteredCustomers.length === 0 && (
          <div className="bg-white rounded-xl shadow text-center py-16 mt-4">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700">
              No customers found
            </h3>
            <p className="text-gray-500">Try adjusting your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetCustomers;
