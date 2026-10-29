
import { useState } from "react";
import api from "../api/axios";
import "./Auth.css";

function Login({ onLogin, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", formData);
      const { token, user } = response.data;

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));

      onLogin(user);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">V</div>
          <h2>VehicleCare</h2>
          <p>Vehicle Service Log</p>
        </div>

        <h3>Welcome back!</h3>
        <p className="auth-subtitle">
          Sign in to manage your vehicles and services.
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <button type="button" onClick={onSwitchToRegister}>
            Create account
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
