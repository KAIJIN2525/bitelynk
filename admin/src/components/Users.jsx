"use client";

import { useState, useEffect } from "react";
import {
  FiSearch,
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiMail,
  FiPhone,
  FiUsers,
} from "react-icons/fi";
import Card from "./Card";
import LoadingSpinner from "./LoadingSpinner";
import {
  fetchAllUsers,
  fetchUserTotalSpent,
} from "../lib/services/userService";
import { fetchNewUsersThisMonth } from "../lib/services/newUserService";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [newUsersThisMonth, setNewUsersThisMonth] = useState(0);

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const res = await fetchAllUsers();
        const usersWithTotal = await Promise.all(
          (res.users || []).map(async (user) => {
            let totalSpent = 0;
            try {
              const totalRes = await fetchUserTotalSpent(user._id);
              totalSpent = totalRes.totalSpent || 0;
            } catch {}
            return { ...user, totalSpent };
          })
        );
        setUsers(usersWithTotal);
      } catch (error) {
        // Optionally show a toast or error
      } finally {
        setLoading(false);
      }
    };
    getUsers();
    // Fetch new users this month
    const getNewUsersThisMonth = async () => {
      try {
        const res = await fetchNewUsersThisMonth();
        setNewUsersThisMonth(res.count || 0);
      } catch {
        setNewUsersThisMonth(0);
      }
    };
    getNewUsersThisMonth();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredUsers = users.filter((user) => {
    // Use backend fields: username, email, role, status (if any)
    const name = user.username || user.name || "";
    const email = user.email || "";
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || (user.status && user.status === statusFilter);
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (userId, newStatus) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">
            Manage customer accounts and user data
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {users.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <FiUsers className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {users.filter((u) => u.status === "active").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <FiUsers className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                New This Month
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{newUsersThisMonth}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <FiUsers className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">7.7</p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <FiUsers className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <Card title="All Users" subtitle={`${filteredUsers.length} users found`}>
        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">Orders</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">Total Spent</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">Join Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {(() => {
                              const name = user.username || user.name || "";
                              return name
                                .split(" ")
                                .filter(Boolean)
                                .map((n) => n[0])
                                .join("");
                            })()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <FiMail className="w-4 h-4" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <FiPhone className="w-4 h-4" />
                          <span>{user.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 text-sm rounded-full ${getStatusColor(
                          user.status
                        )}`}
                      >
                        <span>
                          {user.status
                            ? user.status.charAt(0).toUpperCase() +
                              user.status.slice(1)
                            : "N/A"}
                        </span>
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {user.totalOrders}
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-900">
                      ₦{user.totalSpent?.toLocaleString() || 0}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <FiMoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Users;
