"use client";

import { useState, useEffect } from "react";
import {
  FiPackage,
  FiShoppingCart,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";
import { fetchAllUsers } from "../lib/services/userService";
import { productService } from "../lib/services/productService";
import { orderService } from "../lib/services/orderService";
import { fetchNewUsersThisMonth } from "../lib/services/newUserService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [newUsersThisMonth, setNewUsersThisMonth] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all users, products, orders, and new users this month in parallel
        const [usersRes, productsRes, ordersRes, newUsersRes] =
          await Promise.all([
            fetchAllUsers(),
            productService.getAllProducts(),
            orderService.fetchAllOrders(),
            fetchNewUsersThisMonth(),
          ]);
        // Use correct response properties
        const users = usersRes?.data || usersRes?.users || [];
        const products = productsRes?.data || productsRes?.products || [];
        const orders = ordersRes?.orders || ordersRes?.data || [];
        const totalUsers = users.length;
        const totalProducts = products.length;
        const totalOrders = orders.length;
        // Calculate total revenue from orders
        const totalRevenue = orders.reduce(
          (sum, order) => sum + (order.total || 0),
          0
        );
        setStats({ totalProducts, totalOrders, totalUsers, totalRevenue });
        setNewUsersThisMonth(newUsersRes?.count || 0);
        // Set recent orders (latest 4)
        setRecentOrders(orders.slice(0, 4));
        // Set top products by sales (if available)
        setTopProducts(products.slice(0, 4));
      } catch (err) {
        // fallback to zeros if error
        setStats({
          totalProducts: 0,
          totalOrders: 0,
          totalUsers: 0,
          totalRevenue: 0,
        });
        setNewUsersThisMonth(0);
        setRecentOrders([]);
        setTopProducts([]);
      }
    };
    fetchStats();
  }, []);

  const statsCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: FiPackage,
      color: "bg-primary",
      change: "+12%",
      isPositive: true,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: FiShoppingCart,
      color: "bg-primary-dark",
      change: "+8%",
      isPositive: true,
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: FiUsers,
      color: "bg-dark-accent",
      change: "+15%",
      isPositive: true,
    },
    {
      title: "Revenue",
      value: `₦${stats.totalRevenue.toLocaleString()}`,
      icon: FiDollarSign,
      color: "bg-primary/80",
      change: "-3%",
      isPositive: false,
    },
  ];

  return (
    <div className="space-y-6 bg-light-background p-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-secondary mt-1">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>
        <div className="text-sm text-text-secondary">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          const TrendIcon = card.isPositive ? FiTrendingUp : FiTrendingDown;

          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-text-primary mt-2">
                    {card.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendIcon
                  className={`w-4 h-4 ${
                    card.isPositive ? "text-success" : "text-error"
                  } mr-1`}
                />
                <span
                  className={`text-sm font-medium ${
                    card.isPositive ? "text-success" : "text-error"
                  }`}
                >
                  {card.change}
                </span>
                <span className="text-sm text-text-secondary ml-1">
                  from last month
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-border p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Recent Orders
          </h3>
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <p className="text-text-secondary">No recent orders.</p>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order.id || order._id}
                  className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-light-background rounded-lg flex items-center justify-center">
                      <FiShoppingCart className="w-5 h-5 text-text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">
                        Order #{order.id || order._id}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {order.items?.length || 0} items • ₦
                        {order.total?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
                    {order.status || "Completed"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-border p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Top Products
          </h3>
          <div className="space-y-4">
            {topProducts.length === 0 ? (
              <p className="text-text-secondary">No products found.</p>
            ) : (
              topProducts.map((product) => (
                <div
                  key={product.id || product._id}
                  className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-light-background rounded-lg flex items-center justify-center">
                      <FiPackage className="w-5 h-5 text-text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">
                        {product.name}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {product.sold || 0} sold
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-text-primary">
                    ₦{product.price?.toFixed(2) || "0.00"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
