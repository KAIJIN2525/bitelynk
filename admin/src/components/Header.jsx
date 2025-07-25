import { useState } from "react";
import { FiMenu, FiBell, FiSearch, FiUser } from "react-icons/fi";

const Header = ({ toggleSidebar, user, notifications = [], onNotificationClick }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const notificationCount = notifications.length;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors">
            <FiMenu className="w-5 h-5 text-gray-600" />
          </button>

          {/* Search bar */}
          <div className="hidden md:flex items-center bg-gray-50 rounded-lg px-4 py-2 w-96">
            <FiSearch className="w-4 h-4 text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search products, orders, users..."
              className="bg-transparent outline-none text-gray-600 placeholder-gray-400 w-full"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4 relative">
          {/* Notifications */}
          <button
            className="relative p-2 rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => setDropdownOpen((open) => !open)}
          >
            <FiBell className="w-5 h-5 text-gray-600" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">{notificationCount}</span>
            )}
          </button>
          {/* Notification Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              <div className="p-4 border-b font-semibold text-gray-700">Notifications</div>
              {notifications.length === 0 ? (
                <div className="p-4 text-gray-500 text-sm">No notifications</div>
              ) : (
                notifications.map((n) => (
                  <div key={n._id} className={`px-4 py-3 border-b last:border-b-0 ${n.read ? 'bg-gray-50' : 'bg-amber-50'}`}>
                    <div className="font-medium text-gray-800">{n.message}</div>
                    <div className="text-xs text-gray-500 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                  </div>
                ))
              )}
            </div>
          )}
          {/* Profile */}
          <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <FiUser className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-800">{user?.name || user?.username || "Admin User"}</p>
              <p className="text-xs text-gray-500">{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Administrator"}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
