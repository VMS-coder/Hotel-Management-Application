
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [menuOpen, setMenuOpen] = useState(false);

  // Refresh user information after login/logout navigation
  useEffect(() => {
    try {
      setUser(JSON.parse(localStorage.getItem("user")) || null);
    } catch {
      setUser(null);
    }

    setMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setMenuOpen(false);
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `hotel-nav-link ${isActive ? "active" : ""}`;

  return (
    <nav className="hotel-navbar">
      <div className="hotel-nav-container">

        <Link to="/" className="hotel-brand">
          <span className="brand-icon">🏨</span>
          HotelPro
        </Link>

        <button
          className="nav-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`hotel-nav-links ${menuOpen ? "show" : ""}`}>

          <NavLink to="/" className={linkClass}>Home</NavLink>

          <NavLink to="/rooms" className={linkClass}>Rooms</NavLink>

          {!user ? (
            <>
              <NavLink to="/login" className={linkClass}>Login</NavLink>

              <Link
                to="/register"
                className="nav-register-btn"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <NavLink
                to={user.isAdmin ? "/admin" : "/dashboard"}
                className={linkClass}
              >
                {user.isAdmin ? "Admin Dashboard" : "My Dashboard"}
              </NavLink>

              <button
                className="nav-logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Header;
