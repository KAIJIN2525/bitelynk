import React, { useEffect, useState } from "react";
import { layoutClasses, tableClasses } from "../../assets/dummyadmin";
import { apiServices } from "../../lib/services";
import { toast } from "sonner";
import { FiLoader, FiUser } from "react-icons/fi";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiServices.users.getAllUsers();
        if (response.success) {
          setUsers(response.data || []);
        } else {
          setError(response.message || "Failed to fetch users");
          toast.error(response.message || "Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Error fetching users");
        toast.error("Error fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className={layoutClasses.page}>
        <div className="mx-auto max-w-7xl">
          <div className={layoutClasses.card}>
            <div className="flex items-center justify-center h-64">
              <FiLoader className="animate-spin text-2xl text-amber-500" />
              <span className="ml-2 text-amber-100">Loading users...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={layoutClasses.page}>
        <div className="mx-auto max-w-7xl">
          <div className={layoutClasses.card}>
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-red-400">Error: {error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={layoutClasses.page}>
      <div className="mx-auto max-w-7xl">
        <div className={layoutClasses.card}>
          <h2 className={layoutClasses.heading}>User Management</h2>
          <div className="mb-8">
            <h3 className="text-xl font-bold text-amber-300 mb-4">Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-gray-400">Total Users</h4>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-gray-400">Admins</h4>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.isAdmin).length}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-gray-400">Regular Users</h4>
                <p className="text-2xl font-bold text-white">{users.filter(u => !u.isAdmin).length}</p>
              </div>
            </div>
          </div>
          <div className={tableClasses.wrapper}>
            <table className={tableClasses.table}>
              <thead className={tableClasses.headerRow}>
                <tr>
                  {["User", "Email", "Phone", "Address", "Role"].map((h) => (
                    <th key={h} className={tableClasses.headerCell}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className={tableClasses.row}>
                    <td className={`${tableClasses.cellBase} text-amber-100`}>
                      <div className="flex items-center gap-2">
                        <FiUser className="text-amber-400" />
                        <div className="font-medium truncate">
                          {user.username}
                        </div>
                      </div>
                    </td>
                    <td className={`${tableClasses.cellBase} text-amber-100/80`}>
                      {user.email}
                    </td>
                    <td className={`${tableClasses.cellBase} text-amber-100/80`}>
                      {user.phone || "N/A"}
                    </td>
                    <td className={`${tableClasses.cellBase} text-amber-100/80`}>
                      <div className="max-w-xs">
                        <div className="truncate">
                          {user.address?.street || "N/A"}
                        </div>
                        <div className="text-sm text-amber-100/60">
                          {user.address?.city}, {user.address?.state}
                        </div>
                      </div>
                    </td>
                    <td className={`${tableClasses.cellBase} text-amber-100/80`}>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          user.isAdmin
                            ? "bg-green-600/30 text-green-300 border-green-500/50"
                            : "bg-gray-600/30 text-gray-300 border-gray-500/50"
                        }`}
                      >
                        {user.isAdmin ? "Admin" : "User"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
