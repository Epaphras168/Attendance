import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { user, error: loginError } = await login(email, password);
      if (loginError) throw loginError;

      if (!user) throw new Error("No user returned");

      // Redirect based on role
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "teacher") navigate("/teacher");
      else throw new Error("User role not recognized");
    } catch (err) {
      setError(err.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Student Attendance System
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-2"
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
