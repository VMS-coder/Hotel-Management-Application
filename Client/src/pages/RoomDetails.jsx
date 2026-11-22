import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await API.get(`/rooms/${id}`);
        setRoom(response.data);
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Unable to load room"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!roomNumber || !checkIn || !checkOut) {
      setMessage("Please fill all booking details");
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      setMessage("Check-out date must be after check-in date");
      return;
    }

    try {
      const response = await API.post("/bookings", {
        roomId: id,
        roomNumber: Number(roomNumber),
        checkIn,
        checkOut
      });

      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (error) {
      setMessage(
        error.response?.data?.message || "Booking failed"
      );
    }
  };

  if (loading) return <p>Loading room details...</p>;
  if (!room) return <p>{message || "Room not found"}</p>;

  return (
    <div className="room-details">
      <h1>{room.title}</h1>

      {room.image && (
        <img
          src={`http://localhost:5000${room.image}`}
          alt={room.title}
          className="room-image"
        />
      )}

      <p>{room.description}</p>
      <p>Price: ₹{room.price} / night</p>
      <p>Maximum People: {room.maxPeople}</p>

      <form onSubmit={handleBooking}>
        <label>Check-in Date</label>
        <input
          type="date"
          value={checkIn}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setCheckIn(e.target.value)}
          required
        />

        <label>Check-out Date</label>
        <input
          type="date"
          value={checkOut}
          min={checkIn || new Date().toISOString().split("T")[0]}
          onChange={(e) => setCheckOut(e.target.value)}
          required
        />

        <label>Select Room Number</label>
        <select
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          required
        >
          <option value="">Select a room</option>

          {room.roomNumbers.map((number) => (
            <option key={number} value={number}>
              Room {number}
            </option>
          ))}
        </select>

        <button type="submit">
          Confirm Booking
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default RoomDetails;