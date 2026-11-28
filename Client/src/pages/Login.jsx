
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const response = await API.post("/auth/login", user);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (response.data.user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-visual">
        <div className="auth-visual-content">
          <div className="auth-illustration">🏨</div>
          <h1>Welcome Back!</h1>
          <p>
            Your perfect stay is just a few clicks away.
            Log in to manage your bookings and explore
            comfortable rooms at HotelPro.
          </p>
        </div>
      </div>

      <div className="auth-form-section">
        <div className="auth-form-wrapper">

          <h2>Login to HotelPro</h2>
          <p className="auth-subtitle">
            Enter your credentials to access your account.
          </p>

          {error && <div className="alert alert-danger">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>

            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={user.email}
              onChange={handleChange}
              required
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={user.password}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>

          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Register Now</Link>
          </p>

        </div>
      </div>

    </div>
  );
}

export default Login;
