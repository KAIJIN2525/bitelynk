import { useEffect, useState } from "react";
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiServices } from "../../lib/services";

const AwesomeToast = ({ message, icon }) => {
  return (
    <div className="animate-slide-in fixed bottom-6 right-6 flex items-center bg-gradient-to-br from-primary to-primary-dark px-6 py-4 rounded-lg shadow-lg border-2 border-primary/20 z-50">
      <span className="text-2xl mr-3 text-dark-accent">{icon}</span>
      <span className="text-dark-accent font-semibold">{message}</span>
    </div>
  );
};

const SignUp = () => {
  const [showToast, setShowToast] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiServices.auth.register(
        formData.username,
        formData.email,
        formData.password
      );

      if (response.success) {
        toast.success("Account created successfully! Redirecting...");
        setShowToast(true);

        // Redirect to home page after successful registration
        setTimeout(() => {
          setShowToast(false);
          navigate("/"); // Redirect to home page since user is now logged in
        }, 2000);
      } else {
        toast.error(response.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-background p-4">
      {showToast && (
        <AwesomeToast message="Sign up successful!" icon={<FaCheckCircle />} />
      )}

      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-border transform transition-all duration-300 hover:shadow-2xl">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent mb-6 hover:scale-105 transition-transform">
          Create an Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-light-background text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            required
            disabled={isLoading}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-light-background text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            required
            disabled={isLoading}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password (min. 6 characters)"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-light-background text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              required
              disabled={isLoading}
              minLength={6}
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-3 text-primary hover:text-primary-dark transition-colors disabled:opacity-50"
              disabled={isLoading}
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
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-gradient-to-br from-primary to-primary-dark text-dark-accent font-bold hover:scale-105 transition-transform hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-dark-accent border-t-transparent"></div>
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-primary">
          Already have an account?{" "}
          <Link to="/login" className="font-bold hover:text-primary-dark">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
