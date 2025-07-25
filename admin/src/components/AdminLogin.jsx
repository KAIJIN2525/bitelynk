"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { loginAdmin, signupAdmin } from "../lib/services/authService"
import LoginForm from "./auth/LoginForm"
import SignupForm from "./auth/SignupForm"

const AdminLogin = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await loginAdmin(loginData.email, loginData.password)
      localStorage.setItem("token", res.token)
      localStorage.setItem("role", res.role)
      toast.success("Login successful! Welcome back.")
      navigate("/")
    } catch (error) {
      toast.error(error.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validation
    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match")
      setLoading(false)
      return
    }

    if (signupData.password.length < 6) {
      toast.error("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      const res = await signupAdmin(signupData.name, signupData.email, signupData.password)
      toast.success("Admin account created successfully! Please login.")
      setIsLogin(true)
      setSignupData({ name: "", email: "", password: "", confirmPassword: "" })
    } catch (error) {
      toast.error(error.message || "Signup failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
            <span className="text-white font-bold text-2xl">BL</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{isLogin ? "Welcome Back" : "Create Account"}</h1>
          <p className="text-gray-600">
            {isLogin ? "Sign in to your BiteLynk admin account" : "Join BiteLynk as an administrator"}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          {/* Tab Switcher */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                isLogin ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                !isLogin ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Forms */}
          {isLogin ? (
            <LoginForm
              loginData={loginData}
              setLoginData={setLoginData}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              loading={loading}
              onSubmit={handleLoginSubmit}
            />
          ) : (
            <SignupForm
              signupData={signupData}
              setSignupData={setSignupData}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              showConfirmPassword={showConfirmPassword}
              setShowConfirmPassword={setShowConfirmPassword}
              loading={loading}
              onSubmit={handleSignupSubmit}
            />
          )}
        </div>

        {/* Demo Credentials (for login only) */}
        {isLogin && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</p>
            <p className="text-sm text-blue-700">Email: admin@bitelynk.com</p>
            <p className="text-sm text-blue-700">Password: admin123</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 hover:text-blue-700 font-medium">
              {isLogin ? "Sign up here" : "Sign in here"}
            </button>
          </p>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">© 2024 BiteLynk. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
