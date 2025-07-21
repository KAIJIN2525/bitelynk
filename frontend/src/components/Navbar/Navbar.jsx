import { useEffect, useState } from "react";
import { GiChefToque, GiForkKnifeSpoon } from "react-icons/gi";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Login from "../Login/Login";
import {
  FiHome,
  FiPhone,
  FiShoppingCart,
  FiInfo,
  FiMenu,
  FiX,
  FiLogOut,
  FiKey,
  FiUser,
  FiUserCheck,
} from "react-icons/fi";
import { MdRestaurantMenu } from "react-icons/md";
import { useCart } from "../../CartContext/CartContext";
import { apiServices } from "../../lib/services";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(
    apiServices.auth.isAuthenticated()
  );

  // Update auth status when location changes or component mounts
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = apiServices.auth.isAuthenticated();
      setIsAuthenticated(isAuth);

      // Fetch user data if authenticated
      if (isAuth) {
        try {
          const response = await apiServices.user.getProfile();
          if (response.success) {
            setUser(response.user || response.data);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // If profile fetch fails, user might be logged out
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkAuth();

    // Listen for storage changes (e.g., when user logs in/out in another tab)
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [location]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLoginModal(false);
    navigate("/");
  };

  const handleLogout = () => {
    apiServices.auth.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  // Get user initials from name
  const getUserInitials = () => {
    if (!user) return "U";

    const firstName = user.firstName || user.name?.split(" ")[0] || "";
    const lastName = user.lastName || user.name?.split(" ")[1] || "";

    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();

    return lastInitial ? `${firstInitial}${lastInitial}` : firstInitial || "U";
  };

  // EXTRACT DESKTOP AUTH BUTTON
  const renderDesktopAuthButton = () => {
    return isAuthenticated ? (
      <button
        onClick={() => navigate("/profile")}
        className="px-3 py-1.5 md:py-2 lg:py-3 bg-gradient-to-br from-amber-600 to-amber-700 text-[#2D1B0E] rounded-full font-bold hover:shadow-lg hover:shadow-amber-600/40 transition-all transform hover:scale-[1.02] border-2 border-amber-600/20 flex items-center space-x-2 shadow-md shadow-amber-900/20 text-xs md:text-sm lg:text-sm"
      >
        <div className="w-6 h-6 bg-[#2D1B0E] text-amber-400 rounded-full flex items-center justify-center text-xs font-bold">
          {getUserInitials()}
        </div>
        
      </button>
    ) : (
      <button
        onClick={() => navigate("/login")}
        className="px-3 md:px-3 lg:px-6 py-1.5 md:py-2 lg:py-3 bg-gradient-to-br from-amber-600 to-amber-700 text-[#2D1B0E] rounded-2xl font-bold hover:shadow-lg hover:shadow-amber-600/40 transition-all transform hover:scale-[1.02] border-2 border-amber-600/20 flex items-center space-x-2 shadow-md shadow-amber-900/20 text-xs md:text-sm lg:text-sm"
      >
        <FiKey className="text-base md:text-lg lg:text-lg" />
        <span>Login</span>
      </button>
    );
  };

  // EXTRACT MOBILE AUTH BUTTON
  const renderMobileAuthButton = () => {
    return isAuthenticated ? (
      <button
        onClick={() => navigate("/profile")}
        className="p-2 text-amber-100 rounded-xl transition-all relative border-2 border-amber-900/30 hover:border-amber-600/50 hover:bg-amber-900/20 hover:shadow-lg hover:shadow-amber-500/30 shadow-md shadow-amber-900/20"
        title="Profile"
      >
        <div className="w-6 h-6 bg-amber-400 text-[#2D1B0E] rounded-full flex items-center justify-center text-xs font-bold">
          {getUserInitials()}
        </div>
      </button>
    ) : (
      <button
        onClick={() => navigate("/login")}
        className="p-2 text-amber-100 rounded-xl transition-all relative border-2 border-amber-900/30 hover:border-amber-600/50 hover:bg-amber-900/20 hover:shadow-lg hover:shadow-amber-500/30 shadow-md shadow-amber-900/20"
        title="Login"
      >
        <FiUser className="w-6 h-6" />
      </button>
    );
  };

  useEffect(() => {
    setShowLoginModal(location.pathname === "/login");
    setIsAuthenticated(Boolean(localStorage.getItem("loginData")));
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", to: "/", icon: <FiHome /> },
    { name: "Menu", to: "/menu", icon: <MdRestaurantMenu /> },
    { name: "About", to: "/about", icon: <FiInfo /> },
    { name: "Contact", to: "/contact", icon: <FiPhone /> },
  ];

  return (
    <nav className="bg-[#2D1B0E] border-b-4 border-amber-900/30 shadow-amber-900/30 sticky top-0 z-50 shadow-[0_25px_50px_-12px] font-vibes group/nav overflow-hidden">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4 overflow-hidden">
        <div className="h-[6px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent shadow-amber-500/30" />
        <div className="flex justify-between px-6">
          <GiForkKnifeSpoon
            className="text-amber-500/40 -mt-4 -ml-2 rotate-45"
            size={32}
          />
          <GiForkKnifeSpoon
            className="text-amber-500/40 -mt-4 -mr-2 rotate-45"
            size={32}
          />
        </div>
      </div>

      {/* MAIN NAVIGATION CONTAINER */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 relative overflow-hidden">
        <div className="flex justify-between items-center h-16 md:h-20 lg:h-24">
          {/* LOGO SECTION */}
          <div className="flex-shrink-0 flex items-center space-x-2 group relative md:-translate-x-4 lg:-translate-x-6 ml-0 md:ml-2">
            <div className="absolute -inset-4 bg-amber-500/10 rounded-full blur-xl opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300" />

            <GiChefToque className="text-3xl md:text-4xl lg:text-5xl text-amber-500 transition-all group-hover:rotate-12 group-hover:text-amber-400 hover:drop-shadow-[0_0_15px] hover:drop-shadow-500/50" />

            <div className="flex flex-col ml-2 max-w-[140px] md:max-w-[160px] lg:max-w-none ">
              <NavLink
                to="/"
                className="text-2xl md:text-xl lg:text-4xl bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent font-monsieur tracking-wider drop-shadow-[0_2px_2px] drop-shadow-black -translate-x-2 truncate md:truncate-none"
              >
                BiteLynk
              </NavLink>
              <div className="h-[3px] bg-gradient-to-r from-amber-600/30 via-amber-400/50 to-amber-600/30 w-full mt-1 ml-1 shadow-[0_2px_5px] shadow-amber-500/20 " />
            </div>
          </div>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden md:flex items-center space-x-2 md:space-x-1 lg:space-x-4 flex-1 justify-end">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                className={({
                  isActive,
                }) => `group px-2 md:px-3 lg:px-4 py-2 text-sm md:text-[15px] lg:text-base relative transition-all duration-300 flex items-center hover:bg-amber-900/20 rounded-3xl border-2 
                  ${
                    isActive
                      ? "bg-amber-900/20 border-amber-600/50 shadow-[inset_0_0_15px] shadow-amber-500/20 "
                      : "border-amber-900/30 hover:border-amber-600/50"
                  } shadow-md shadow-amber-900/20
                `}
              >
                <span className="mr-2 tex-sm md:text-[15px] lg:text-base text-amber-500  group-hover:text-amber-300 translate-all">
                  {link.icon}
                </span>
                <span className="text-amber-100 group-hover:text-amber-300 relative">
                  {link.name}
                </span>
              </NavLink>
            ))}

            <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-4 ml-3 md:ml-3 lg:ml-6 mr-2 md:mr-3 lg:mr-4">
              <NavLink
                to="/cart"
                className="p-2 md:p-2.5 lg:p-3 text-amber-100 rounded-xl transition-all relative border-2 border-amber-900/30 hover:border-amber-600/50 group-hover:bg-amber-900/20  hover:shadow-lg hover:shadow-amber-500/30 shadow-md shadow-amber-900/20"
              >
                <FiShoppingCart className="text-base md:text-lg lg:text-lg" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-600 text-amber-100 text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </NavLink>

              {/* Profile Link - Only show when authenticated */}
              {/* {isAuthenticated && (
                <NavLink
                  to="/profile"
                  className="p-2 md:p-2.5 lg:p-3 text-amber-100 rounded-xl transition-all relative border-2 border-amber-900/30 hover:border-amber-600/50 group-hover:bg-amber-900/20  hover:shadow-lg hover:shadow-amber-500/30 shadow-md shadow-amber-900/20"
                >
                  <FiUser className="text-base md:text-lg lg:text-lg" />
                </NavLink>
              )} */}

              {/* DESKTOP AUTH BUTTON */}
              {renderDesktopAuthButton()}
            </div>
          </div>

          {/* MOBILE CART & MENU */}
          <div className="flex items-center space-x-2 mr-2 md:hidden">
            {/* Mobile Cart Button */}
            <NavLink
              to="/cart"
              className="p-2 text-amber-100 rounded-xl transition-all relative border-2 border-amber-900/30 hover:border-amber-600/50 hover:bg-amber-900/20 hover:shadow-lg hover:shadow-amber-500/30 shadow-md shadow-amber-900/20"
            >
              <FiShoppingCart className="size-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-2 bg-amber-600 text-amber-100 text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </NavLink>
            {/* Mobile Auth Button */}
            {renderMobileAuthButton()}
            {/* Mobile Menu Button */}
            <button
              className="text-amber-500 hover:text-amber-300 focus:outline-none transition-all p-2 rounded-xl border-2 border-amber-900/30 hover:border-amber-600/50 relative shadow-md shadow-amber-900/20 hover:shadow-lg hover:shadow-amber-500/30"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <FiX className="w-6 h-6 transition-all duration-300" />
              ) : (
                <FiMenu className="w-6 h-6 transition-all duration-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE NAVIGATION */}

      {isOpen && (
        <div className="md:hidden bg-[#2D1B0E] border-t-4 border-amber-900/40 relative shadow-lg shadow-amber-900/30 w-full">
          <div className="p-4 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                className={({ isActive }) =>
                  `flex px-4 py-3 text-sm text-amber-100 rounded-xl transition-all items-center ${
                    isActive
                      ? "bg-amber-900/20 text-amber-400"
                      : "text-amber-100 hover:bg-amber-600/20"
                  } border-b-2 ${
                    isActive
                      ? "border-amber-600/50"
                      : "border-b border-amber-900/30"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-2 text-base text-amber-500">
                  {link.icon}
                </span>
                <span>{link.name}</span>
              </NavLink>
            ))}

            {/* Profile Link - Only show when authenticated */}
            {isAuthenticated && (
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex px-4 py-3 text-sm text-amber-100 rounded-xl transition-all items-center ${
                    isActive
                      ? "bg-amber-900/20 text-amber-400"
                      : "text-amber-100 hover:bg-amber-600/20"
                  } border-b-2 ${
                    isActive
                      ? "border-amber-600/50"
                      : "border-b border-amber-900/30"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-2 text-base text-amber-500">
                  <FiUser />
                </span>
                <span>Profile</span>
              </NavLink>
            )}
          </div>
        </div>
      )}

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#2D1B0E] to-[#4a372a] rounded-xl p-6 w-full max-w-[480px] relative border-4 border-amber-700/30 shadow-[0_0_30px] shadoww-amber-500/30 ">
            <button
              onClick={() => navigate("/")}
              className="absolute top-2 right-2 text-amber-300 text-2xl"
            >
              <FiX />
            </button>
            <h2 className="text-2xl font-bold bg-gradient-to-r text-center from-amber-400 to-amber-600 bg-clip-text text-transparent mb-4">
              BiteLynk
            </h2>
            <Login
              onLoginSuccess={handleLoginSuccess}
              onClose={() => navigate("/")}
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
