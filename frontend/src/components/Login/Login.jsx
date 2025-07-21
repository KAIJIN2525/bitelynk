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
  FaEnvelope,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { apiServices } from "../../lib/services";

const Login = ({ onLoginSuccess, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  useEffect(() => {
    // Check if user wants to be remembered
    const stored = localStorage.getItem("loginData");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.rememberMe) {
          setFormData((prev) => ({
            ...prev,
            email: parsed.email || "",
            rememberMe: true,
          }));
        }
      } catch (error) {
        console.error("Error loading saved login data:", error);
      }
    }
  }, []);

  const handleChange = ({ target: { name, value, type, checked } }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiServices.auth.login(
        formData.email,
        formData.password
      );

      if (response.success) {
        // Save remember me preference
        if (formData.rememberMe) {
          const loginData = {
            email: formData.email,
            rememberMe: true,
            token: response.token,
            loginTime: new Date().toISOString(),
          };
          localStorage.setItem("loginData", JSON.stringify(loginData));
        }

        toast.success("Login successful!");

        // Close modal and trigger success callback after a short delay
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess();
          if (onClose) onClose();
        }, 1500);
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 relative">

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <FaEnvelope className={iconClass} />
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            placeholder="Email Address"
            onChange={handleChange}
            className={`${inputBase} pl-10 pr-4 py-3`}
            required
            disabled={isLoading}
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
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-400 hover:text-amber-200 transition-colors duration-200"
            disabled={isLoading}
          >
            {showPassword ? (
              <FaEyeSlash className="w-5 h-5" />
            ) : (
              <FaEye className="w-5 h-5" />
            )}
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

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-[#2D1B0E] font-bold rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#2D1B0E] border-t-transparent"></div>
              Signing In...
            </>
          ) : (
            <>
              Sign In <FaArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <div className="text-center">
        <Link
          to="/signup"
          onClick={onClose}
          className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-600 transition-colors duration-200"
        >
          <FaUserPlus className="w-5 h-5" />
          Create New Account
        </Link>
      </div>
    </div>
  );
};

export default Login;
