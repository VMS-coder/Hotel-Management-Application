import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

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

      setMessage(response.data.message);
      fetchBookings();

    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to cancel booking"
      );
    }
  };

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="user-dashboard">
      <h1>My Dashboard</h1>
      <h2>My Bookings</h2>

      {message && <p>{message}</p>}

      {bookings.length === 0 ? (
        <div>
          <p>You have not made any bookings yet.</p>
          <button onClick={() => navigate("/rooms")}>
            Explore Rooms
          </button>
        </div>
      ) : (
        <div className="bookings-container">
          {bookings.map((booking) => (
            <div className="booking-card" key={booking._id}>
              <h3>
                {booking.roomId?.title || "Room"}
              </h3>

              {booking.roomId?.image && (
                <img
                  src={`http://localhost:5000${booking.roomId.image}`}
                  alt={booking.roomId.title}
                  className="room-image"
                />
              )}

              <p>Room Number: {booking.roomNumber}</p>

              <p>
                Check-in:{" "}
                {new Date(booking.checkIn).toLocaleDateString()}
              </p>

              <p>
                Check-out:{" "}
                {new Date(booking.checkOut).toLocaleDateString()}
              </p>

              <p>Total Days: {booking.totalDays}</p>
              <p>Total Amount: ₹{booking.totalAmount}</p>

              <p>Status: {booking.status}</p>

              {booking.status === "Booked" && (
                <button
                  onClick={() => handleCancel(booking._id)}
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserDashboard;