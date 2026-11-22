
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

function Register() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
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
        "/auth/register",
        user
      );

      alert(response.data.message);
      navigate("/login");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Registration failed"
      );
    }
  };

  return (
    <div className="container mt-5">
      <div className="col-md-5 mx-auto">
        <h2 className="text-center mb-4">
          Create Account
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-3"
            type="text"
            name="username"
            placeholder="Enter Username"
            value={user.username}
            onChange={handleChange}
            required
          />

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
            minLength={6}
          />

          <button
            className="btn btn-primary w-100"
            type="submit"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-3">
          Already registered?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
