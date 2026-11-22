
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import AddRoom from "./AddRoom";
import "./Admin.css";

function Admin() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("rooms");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  // Check admin authentication
  useEffect(() => {
    if (!token || !user || !user.isAdmin) {
      navigate("/login");
    }
  }, [token, user, navigate]);

  // Fetch all rooms from backend
  const fetchRooms = async () => {
    try {
      setLoading(true);

      const response = await API.get("/rooms");

      setRooms(response.data);
    } catch (error) {
      alert(
        error.response?.data?.message || "Unable to fetch rooms"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user?.isAdmin) {
      fetchRooms();
    }
  }, [token, user]);

  // Logout functionality
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // Delete room
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this room?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/rooms/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Room deleted successfully!");

      fetchRooms();
    } catch (error) {
      alert(
        error.response?.data?.message || "Unable to delete room"
      );
    }
  };

  return (
    <div className="admin-container">

      {/* Dashboard Header */}
      <div className="admin-header">
        <div>
          <h1>HotelPro Admin</h1>
          <p>Welcome, {user?.username || user?.name || "Admin"}</p>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Dashboard Tabs */}
      <div className="admin-tabs">

        <button
          className={activeTab === "rooms" ? "active" : ""}
          onClick={() => setActiveTab("rooms")}
        >
          All Rooms
        </button>

        <button
          className={activeTab === "addRoom" ? "active" : ""}
          onClick={() => setActiveTab("addRoom")}
        >
          Add Room
        </button>

        <button
          className={activeTab === "bookings" ? "active" : ""}
          onClick={() => setActiveTab("bookings")}
        >
          All Bookings
        </button>

        <button
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          All Users
        </button>

      </div>

      {/* Tab Content */}

      <div className="admin-content">

        {/* All Rooms */}
        {activeTab === "rooms" && (
          <div>
            <h2>All Rooms</h2>

            {loading ? (
              <p>Loading rooms...</p>
            ) : rooms.length === 0 ? (
              <p>No rooms available. Add your first room!</p>
            ) : (
              <div className="room-grid">

                {rooms.map((room) => (
                  <div className="room-card" key={room._id}>

                    {room.image && (
                      <img
                        src={`http://localhost:5000${room.image}`}
                        alt={room.title}
                      />
                    )}

                    <div className="room-info">
                      <h3>{room.title}</h3>

                      <p>{room.description}</p>

                      <p>
                        <strong>Price:</strong> ₹{room.price}
                      </p>

                      <p>
                        <strong>Maximum People:</strong>{" "}
                        {room.maxPeople}
                      </p>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(room._id)}
                      >
                        Delete Room
                      </button>
                    </div>

                  </div>
                ))}

              </div>
            )}
          </div>
        )}

        {/* Add Room */}
        {activeTab === "addRoom" && (
          <AddRoom
            onRoomAdded={() => {
              fetchRooms();
              setActiveTab("rooms");
            }}
          />
        )}

        {/* All Bookings */}
        {activeTab === "bookings" && (
          <div>
            <h2>All Bookings</h2>
            <p>Booking management will be added later.</p>
          </div>
        )}

        {/* All Users */}
        {activeTab === "users" && (
          <div>
            <h2>All Users</h2>
            <p>User management will be added later.</p>
          </div>
        )}

      </div>

    </div>
  );
}

export default Admin;
