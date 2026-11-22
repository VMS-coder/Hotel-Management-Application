# HotelPro Backend

## 1. Install
Open a terminal in this `server` folder and run:

```bash
npm install
```

## 2. Environment variables
Copy `.env.example` to a new file named `.env`, then fill in:
- `MONGO_URI`: your MongoDB Atlas connection string
- `JWT_SECRET`: a long random secret string
- `ADMIN_EMAIL`: the email address that should receive admin access when registering
- `CLIENT_URL`: your Vite frontend URL (usually `http://localhost:5173`)

Do not upload `.env` to GitHub.

In MongoDB Atlas, create a database user and allow your development IP address in Network Access. Replace the username/password/cluster placeholders in `MONGO_URI`. URL-encode special characters in the database password.

## 3. Run
Development:

```bash
npm run dev
```

Or:

```bash
npm start
```

Test `http://localhost:5000/` in a browser.

## 4. API endpoints

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/rooms` | Get all rooms | Public |
| GET | `/api/rooms/:id` | Get one room | Public |
| POST | `/api/rooms` | Create room | Admin token |
| DELETE | `/api/rooms/:id` | Delete room | Admin token |

### Register body
```json
{
  "username": "Hotel Admin",
  "email": "admin@example.com",
  "password": "change-this-password"
}
```

The email matching `ADMIN_EMAIL` in `.env` receives admin access. Register that account first. Do not expose admin registration as a public role-selection option.

### Login body
```json
{
  "email": "admin@example.com",
  "password": "change-this-password"
}
```

Login returns a JWT token. Send it for protected room operations as:
`Authorization: Bearer YOUR_TOKEN`

### Create room body
```json
{
  "title": "Deluxe Room",
  "description": "Air-conditioned room with a king bed",
  "price": 2500,
  "maxPeople": 2,
  "roomNumbers": [101, 102],
  "image": "https://example.com/room.jpg"
}
```

## 5. Axios examples (React client)

```js
import axios from "axios";

const API = "http://localhost:5000/api";

// Register
const register = await axios.post(`${API}/auth/register`, {
  username: "Aman",
  email: "aman@example.com",
  password: "password123"
});

// Login
const login = await axios.post(`${API}/auth/login`, {
  email: "admin@example.com",
  password: "change-this-password"
});

// Create room (use token returned by login)
const token = login.data.token;
await axios.post(`${API}/rooms`, {
  title: "Deluxe Room",
  description: "Air-conditioned room",
  price: 2500,
  maxPeople: 2,
  roomNumbers: [101, 102]
}, {
  headers: { Authorization: `Bearer ${token}` }
});

// Get rooms
const rooms = await axios.get(`${API}/rooms`);
```

## Notes
- Passwords are hashed with bcryptjs; plain passwords are never returned.
- JWT protects room creation and deletion.
- Only the email configured as `ADMIN_EMAIL` is made admin at registration.
- This is a learning starter backend. Before production, add stronger validation, rate limiting, secure deployment settings, booking availability logic, and tests.
