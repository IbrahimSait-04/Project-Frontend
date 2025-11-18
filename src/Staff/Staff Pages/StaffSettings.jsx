import React from "react";
import { Settings } from "lucide-react";

const StaffSettings = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-yellow-800 mb-6 flex items-center gap-2">
        <Settings size={28} /> Staff Settings
      </h1>
      <p className="text-gray-700">
        Settings page for staff members. Configure your account preferences here.
      </p>
    </div>
  );
};

export default StaffSettings;
