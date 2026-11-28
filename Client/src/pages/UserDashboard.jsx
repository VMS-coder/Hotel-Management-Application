
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Logout from "../components/Logout";
import "./UserDashboard.css";

function UserDashboard() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchBookings = async () => {
    try {
      const response = await API.get("/bookings/my-bookings");
      setBookings(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to load bookings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchBookings();
  }, [navigate]);

  const handleCancel = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    try {
      const response = await API.delete(`/bookings/${bookingId}`);

      setMessage(response.data.message || "Booking cancelled successfully");
      await fetchBookings();

    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to cancel booking"
      );
    }
  };

  const totalBookings = bookings.length;

  const activeBookings = bookings.filter(
    (booking) => booking.status === "Booked"
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "Cancelled"
  ).length;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="user-dashboard">

      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <p className="dashboard-subtitle">WELCOME TO HOTELPRO</p>
          <h1>My Dashboard</h1>
          <p>Manage your bookings and enjoy your stay.</p>
        </div>

        <Logout />
      </div>

      {/* Statistics */}
      <div className="dashboard-stats">

        <div className="stat-card">
          <div className="stat-icon blue">📋</div>
          <div>
            <h3>{totalBookings}</h3>
            <p>Total Bookings</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">🏨</div>
          <div>
            <h3>{activeBookings}</h3>
            <p>Active Bookings</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">✕</div>
          <div>
            <h3>{cancelledBookings}</h3>
            <p>Cancelled Bookings</p>
          </div>
        </div>

      </div>

      {/* Bookings Section */}
      <div className="bookings-section">

        <div className="section-heading">
          <div>
            <h2>My Bookings</h2>
            <p>View and manage your hotel reservations.</p>
          </div>

          <button
            className="explore-btn"
            onClick={() => navigate("/rooms")}
          >
            + Explore Rooms
          </button>
        </div>

        {message && (
          <div className="dashboard-message">
            {message}
          </div>
        )}

        {bookings.length === 0 ? (

          <div className="empty-bookings">
            <div className="empty-icon">🛏️</div>
            <h3>No Bookings Yet!</h3>
            <p>
              You haven't made any reservations.
              Explore our rooms and book your perfect stay.
            </p>

            <button onClick={() => navigate("/rooms")}>
              Explore Rooms
            </button>
          </div>

        ) : (

          <div className="bookings-container">

            {bookings.map((booking) => (

              <div className="booking-card" key={booking._id}>

                <div className="booking-image">
                  {booking.roomId?.image ? (
                    <img
                      src={`http://localhost:5000${booking.roomId.image}`}
                      alt={booking.roomId.title || "Hotel Room"}
                    />
                  ) : (
                    <div className="no-room-image">
                      🏨
                    </div>
                  )}
                </div>

                <div className="booking-details">

                  <div className="booking-top">
                    <h3>
                      {booking.roomId?.title || "Room"}
                    </h3>

                    <span
                      className={`booking-status ${
                        booking.status === "Booked"
                          ? "status-booked"
                          : "status-cancelled"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <p className="room-number">
                    Room Number: {booking.roomNumber}
                  </p>

                  <div className="booking-info">

                    <div>
                      <span>Check-in</span>
                      <strong>{formatDate(booking.checkIn)}</strong>
                    </div>

                    <div>
                      <span>Check-out</span>
                      <strong>{formatDate(booking.checkOut)}</strong>
                    </div>

                    <div>
                      <span>Total Days</span>
                      <strong>{booking.totalDays}</strong>
                    </div>

                  </div>

                  <div className="booking-bottom">

                    <div>
                      <span>Total Amount</span>
                      <h3>₹{booking.totalAmount}</h3>
                    </div>

                    {booking.status === "Booked" && (
                      <button
                        className="cancel-booking-btn"
                        onClick={() => handleCancel(booking._id)}
                      >
                        Cancel Booking
                      </button>
                    )}

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default UserDashboard;
