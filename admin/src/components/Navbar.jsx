import React from "react";
import { navLinks, styles } from "../assets/dummyadmin";
import { GiChefToque } from "react-icons/gi";
import { useState } from "react";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav className={styles.navWrapper}>
      <div className={styles.navContainer}>
        <div className={styles.logoSection}>
          <GiChefToque className={styles.logoIcon} />
          <span className={styles.logoText}>Admin Panel</span>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={styles.menuButton}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className={styles.desktopMenu}>
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              className={({ isActive }) =>
                `${styles.navLinkBase} ${
                  isActive ? styles.navLinkActive : styles.navLinkInactive
                }`
              }
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className={`${styles.navLinkBase} ${styles.navLinkInactive} hover:text-red-500`}
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* FOR MOBILE MENU */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `${styles.navLinkBase} ${
                  isActive ? styles.navLinkActive : styles.navLinkInactive
                }`
              }
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className={`${styles.navLinkBase} ${styles.navLinkInactive} hover:text-red-500`}
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
