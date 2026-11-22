
import { Link } from "react-router-dom";

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          HotelPro
        </Link>

        <div className="navbar-nav ms-auto">
          <Link className="nav-link" to="/">Home</Link>
          <Link className="nav-link" to="/rooms">Rooms</Link>
          <Link className="nav-link" to="/login">Login</Link>
          <Link className="nav-link" to="/register">Register</Link>
          <Link className="nav-link" to="/dashboard">My Dashboard</Link>
          <Link className="nav-link" to="/admin">Admin</Link>
          <Link className="nav-link" to="/logout">Logout</Link>
        </div>
      </div>
    </nav>
  );
}
        
export default Header;
