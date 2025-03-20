import React, { useState } from "react";
import Sidebar from "../../../components/admin/layout/Sidebar";

interface AdminProfile {
  id: number;
  username: string;
  email: string;
  password: string;
}

const AdminDashboard = () => {
  const [adminProfiles, setAdminProfiles] = useState<AdminProfile[]>([
    { id: 1, username: "ved", email: "ved@gmail.com", password: "1234" },
    { id: 2, username: "funda", email: "funda@gmail.com", password: "1234" },
    { id: 3, username: "Funda2", email: "g@g.c", password: "1234" },
    { id: 4, username: "Ved 2", email: "ved2@gmail.com", password: "1236" },
  ]);

  // State for revenue statistics
  const [revenue, setRevenue] = useState<number>(0);

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100">
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900">
              Revenue Statistics
            </h2>
            <p className="mt-4 text-2xl font-semibold text-gray-700">
              ${revenue}
            </p>
            {/* Add more statistics as needed */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
