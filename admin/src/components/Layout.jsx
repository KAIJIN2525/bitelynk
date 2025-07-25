import { useState, useEffect } from "react"
import Sidebar from "./Sidebar"
import Header from "./Header"
import { fetchAdminProfile } from "../lib/services/userService"
import { fetchNotifications } from "../lib/services/notificationService"

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    // Fetch admin user profile on mount
    const fetchUser = async () => {
      try {
        const res = await fetchAdminProfile()
        setUser(res.data || res.user || null)
      } catch {
        setUser(null)
      }
    }
    fetchUser()
    // Fetch notifications
    const loadNotifications = async () => {
      try {
        const res = await fetchNotifications();
        setNotifications(res.notifications || []);
      } catch {
        setNotifications([]);
      }
    };
    loadNotifications();
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Example notification click handler
  const handleNotificationClick = () => {
    // You can open a modal, dropdown, or mark notifications as read here
    alert("Show notifications!")
  }
  

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main content */}
        <div className="flex-1 lg:ml-0">
          <Header
            toggleSidebar={toggleSidebar}
            user={user}
            notifications={notifications}
            onNotificationClick={handleNotificationClick}
          />

          {/* Page content */}
          <main className="p-6">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Layout
