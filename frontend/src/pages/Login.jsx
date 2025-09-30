import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth"; // <-- Import useAuth
import { FaUser, FaLock } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import loginIcon from "../assets/logo.png";

export default function Login() {
  // State for form inputs
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // State for UI
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Get functions from AuthContext
  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle traditional form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(identifier, password, rememberMe);
      // On success, AuthContext will handle navigation
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      setLoading(false);
    }
  };

  // Handle Google Login button click
  const handleGoogleLogin = () => {
    // Add "/api" right before "/auth/google"
    // AFTER
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };
  // Handle Forgot Password button click
  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <div className="text-center mb-8">
          <img
            src={loginIcon}
            alt="Login Icon"
            className="mx-auto w-12 h-12 mb-2"
          />
          <h2 className="text-3xl font-bold">Sign In to Your Account</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
              <FaUser />
            </span>
            <input
              type="text"
              name="identifier"
              placeholder="Email Address / Roll Number"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="pl-10 pr-4 py-3 w-full border rounded focus:outline-none focus:ring"
            />
          </div>

          <div className="mb-2 relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
              <FaLock />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 pr-10 py-3 w-full border rounded focus:outline-none focus:ring"
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </span>
          </div>

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                name="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              Remember me
            </label>
            <button
              type="button"
              className="text-blue-600 hover:underline text-sm"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </button>
          </div>

          {error && (
            <p className="text-sm text-center text-red-600 mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded font-semibold hover:bg-indigo-700 transition mb-6 disabled:bg-indigo-400"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-400 text-sm">Or continue with</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <button
          type="button"
          className="flex items-center justify-center w-full border rounded py-3"
          onClick={handleGoogleLogin}
        >
          <FcGoogle className="w-5 h-5 mr-2" />
          <span className="font-medium">Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}
