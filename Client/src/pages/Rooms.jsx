import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await API.get("/rooms");
        setRooms(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load rooms"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) return <p>Loading rooms...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="rooms-page">
      <h1>Available Rooms</h1>

      {rooms.length === 0 ? (
        <p>No rooms available right now.</p>
      ) : (
        <div className="rooms-container">
          {rooms.map((room) => (
            <div className="room-card" key={room._id}>
              {room.image && (
                <img
                  src={`http://localhost:5000${room.image}`}
                  alt={room.title}
                  className="room-image"
                />
              )}

              <h2>{room.title}</h2>
              <p>{room.description}</p>
              <p>Price: ₹{room.price} / night</p>
              <p>Maximum People: {room.maxPeople}</p>

              <Link to={`/rooms/${room._id}`}>
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Rooms;