
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function AddRoom({ onRoomAdded }) {
  const navigate = useNavigate();

  const [room, setRoom] = useState({
    title: "",
    description: "",
    price: "",
    maxPeople: "",
    roomNumbers: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setRoom({
      ...room,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select a room image");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", room.title);
      formData.append("description", room.description);
      formData.append("price", room.price);
      formData.append("maxPeople", room.maxPeople);

      const numbers = room.roomNumbers
        .split(",")
        .map((num) => num.trim())
        .filter(Boolean);

      formData.append("roomNumbers", JSON.stringify(numbers));
      formData.append("image", image);

      const response = await API.post("/rooms", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(response.data.message || "Room added successfully!");

      setRoom({
        title: "",
        description: "",
        price: "",
        maxPeople: "",
        roomNumbers: "",
      });

      setImage(null);

      if (onRoomAdded) {
        onRoomAdded();
      }

    } catch (error) {
      alert(
        error.response?.data?.message || "Unable to add room"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-room-container">

      <h2>Add New Room</h2>

      <form onSubmit={handleSubmit} className="add-room-form">

        <label>Room Title</label>
        <select
          name="title"
          value={room.title}
          onChange={handleChange}
          required
        >
          <option value="">Select Room Type</option>
          <option value="Single Room">Single Room</option>
          <option value="Double Room">Double Room</option>
          <option value="Deluxe Room">Deluxe Room</option>
          <option value="Luxury Room">Luxury Room</option>
          <option value="Suite Room">Suite Room</option>
          <option value="Family Room">Family Room</option>
          <option value="Executive Room">Executive Room</option>
        </select>

        <label>Description</label>
        <textarea
          name="description"
          placeholder="Enter room description"
          value={room.description}
          onChange={handleChange}
          required
        />

        <label>Price Per Night (₹)</label>
        <input
          type="number"
          name="price"
          placeholder="Enter room price"
          value={room.price}
          onChange={handleChange}
          min="1"
          required
        />

        <label>Maximum People</label>
        <input
          type="number"
          name="maxPeople"
          placeholder="Enter maximum people"
          value={room.maxPeople}
          onChange={handleChange}
          min="1"
          required
        />

        <label>Room Numbers</label>
        <input
          type="text"
          name="roomNumbers"
          placeholder="Example: 101, 102, 103"
          value={room.roomNumbers}
          onChange={handleChange}
        />

        <label>Room Image</label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />

        {image && (
          <p>Selected Image: {image.name}</p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Adding Room..." : "Add Room"}
        </button>

      </form>

    </div>
  );
}

export default AddRoom;
