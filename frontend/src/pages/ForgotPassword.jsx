import { useState } from "react";
import api from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setMessage(data.message);
    } catch (err) {
      setMessage(
        "If an account with that email exists, a reset link has been sent."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-6">Forgot Your Password?</h2>
        {!message ? (
          <form onSubmit={handleSubmit}>
            <p className="text-gray-600 mb-4">
              Enter your email to receive a reset link.
            </p>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded py-3 px-4 mb-4"
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded font-semibold"
            >
              Send Reset Link
            </button>
          </form>
        ) : (
          <p className="text-green-600">{message}</p>
        )}
      </div>
    </div>
  );
}
