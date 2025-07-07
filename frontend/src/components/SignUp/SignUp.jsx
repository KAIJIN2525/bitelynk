import { useEffect, useState } from "react";
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const AwesomeToast = ({ message, icon }) => {
  return (
    <div className="animate-slide-in fixed bottom-6 right-6 flex items-center bg-gradient-to-br from-amber-500 to-amber-600 px-6 py-4 rounded-lg shadow-lg border-2 border-amber-300/20 z-50">
      <span className="text-2xl mr-3 text-[#2D1B0E]">{icon}</span>
      <span className="text-[#2D1B0E] font-semibold">{message}</span>
    </div>
  );
};

const SignUp = () => {
  const [showToast, setShowToast] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
        navigate("/login"); // Redirect to login after showing toast
      }, 3000); // Show toast for 3 seconds

      return () => clearTimeout(timer);
    }
  }, [showToast, navigate]);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setShowToast(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a120b] p-4">
      {showToast && (
        <AwesomeToast message="Sign up successful!" icon={<FaCheckCircle />} />
      )}

      <div className="w-full max-w-md bg-gradient-to-br from-[#2D1B0E] to-[#4a372a] p-8 rounded-xl shadow-lg border-4 border-amber-700/30 transform transition-all duration-300 hover:shadow-2xl">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-6 hover:scale-105 transition-transform">
          Create an Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-[#2D1B0E] text-amber-100 placeholder:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 transition-all duration-200 hover:scale-[1.02]"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-[#2D1B0E] text-amber-100 placeholder:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 transition-all duration-200 hover:scale-[1.02]"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-[#2D1B0E] text-amber-100 placeholder:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 transition-all duration-200 hover:scale-[1.02]"
              required
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-3 text-amber-400 hover:text-amber-200 transition-colors"
            >
              {showPassword ? (
                <FaEyeSlash className="text-2xl" />
              ) : (
                <FaEye className="text-2xl" />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-[#2D1B0E] font-bold hover:scale-105 transition-transform hover:shadow-lg"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-amber-400">
          Already have an account?{" "}
          <Link to="/login" className="font-bold hover:text-amber-600">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
