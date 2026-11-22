
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post(
        "/auth/login",
        user
      );

      // Store JWT token
      localStorage.setItem(
        "token",
        response.data.token
      );

      // Store user information
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert("Login Successful!");

      if (response.data.user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Login failed"
      );
    }
  };

  return (
    <div className="container mt-5">
      <div className="col-md-5 mx-auto">
        <h2 className="text-center mb-4">
          Login to HotelPro
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-3"
            type="email"
            name="email"
            placeholder="Enter Email"
            value={user.email}
            onChange={handleChange}
            required
          />

          <input
            className="form-control mb-3"
            type="password"
            name="password"
            placeholder="Enter Password"
            value={user.password}
            onChange={handleChange}
            required
          />

          <button
            className="btn btn-primary w-100"
            type="submit"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-3">
          New User?{" "}
          <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
