import { iconClass, inputBase } from ".././../assets/dummydata";
import { useEffect, useState } from "react";
import {
    FaArrowRight,
  FaCheck,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaUserPlus,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Login = ({ onLoginSuccess, onClose }) => {
  const [showToast, setShowToast] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordIcon, setShowPasswordIcon] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("loginData");
    if (stored) setFormData(JSON.parse(stored));
  }, []);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = ({ target: { name, value, type, checked } }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formData.rememberMe
      ? localStorage.setItem("loginData", JSON.stringify(formData))
      : localStorage.removeItem("loginData");
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000); // Show toast for 3 seconds

    onLoginSuccess();
  };

  return (
    <div className="space-y-6 relative">
      <div
        className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
          showToast ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"
        }`}
      >
        <div className="bg-green-600 text-white px-4 py-3 rounded-md shadow-lg flex items-center gap-2 text-sm">
          <FaCheckCircle className="flex-shrink-0" />
          <span>Login successful!</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <FaUser className={iconClass} />
          <input
            type="text"
            name="username"
            value={formData.username || ""}
            placeholder="Username"
            onChange={handleChange}
            className={`${inputBase} pl-10 pr-4 py-3`}
            required
          />
        </div>
        <div className="relative">
          <FaUser className={iconClass} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password || ""}
            placeholder="Password"
            onChange={handleChange}
            className={`${inputBase} pl-10 pr-4 py-3`}
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-400 hover:text-amber-200 transition-colors duration-200"
          >
            {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex items-center space-x-3">
            <label htmlFor="rememberMe" className="flex items-center">
                <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-amber-600 bg-[#2D1B0E] border-amber-400 rounded focus:ring-amber-500"
                />
                <span className="ml-2 text-amber-100">Remember Me</span>
            </label>
        </div>

        <button className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-[#2D1B0E] font-bold rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform duration-200">
            Sign In <FaArrowRight className="w-5 h-5" />
        </button>
      </form>

      <div className="text-center">
        <Link to="/signup" onClick={onClose} className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-600 transition-colors duration-200">
            <FaUserPlus className="w-5 h-5" />
            Create New Account
        </Link>
      </div>
    </div>
  );
};

export default Login;
