
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

function Register() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      const { confirmPassword, ...registerData } = user;

      const response = await API.post(
        "/auth/register",
        registerData
      );

      alert(response.data.message || "Registration successful!");
      navigate("/login");

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-visual">
        <div className="auth-visual-content">
          <div className="auth-illustration">🛎️</div>
          <h1>Join HotelPro</h1>
          <p>
            Create your account and discover a better
            hotel booking experience. Find your perfect
            room and enjoy a comfortable stay.
          </p>
        </div>
      </div>

      <div className="auth-form-section">
        <div className="auth-form-wrapper">

          <h2>Create Account</h2>
          <p className="auth-subtitle">
            Register to start booking your favourite rooms.
          </p>

          {error && <div className="alert alert-danger">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>

            <label>Full Name</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your full name"
              value={user.username}
              onChange={handleChange}
              required
            />

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
              placeholder="Minimum 6 characters"
              value={user.password}
              onChange={handleChange}
              minLength={6}
              required
            />

            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={user.confirmPassword}
              onChange={handleChange}
              minLength={6}
              required
            />

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "REGISTER"}
            </button>

          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>

        </div>
      </div>

    </div>
  );
}

export default Register;
