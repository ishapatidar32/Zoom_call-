# StreamSync — Real-Time Video Conferencing App

> A full-stack Zoom clone enabling real-time peer-to-peer video conferencing built with WebRTC, Socket.io, React.js, and Node.js.

🌐 **Live Demo:** [https://zoom-call-1-qt88.onrender.com](https://zoom-call-1-qt88.onrender.com)

---

## 📸 Screenshots

> _Add screenshots in a `/screenshots` folder in your repo and update the paths below_

| Landing Page | Home Page | Video Call |
|---|---|---|
| ![Landing](./screenshots/landing.png) | ![Home](./screenshots/home.png) | ![Call](./screenshots/call.png) |

---

## 📌 Table of Contents

- [About the Project](#about-the-project)
- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Author](#author)

---

## 💡 About the Project

**StreamSync** is a production-ready real-time video conferencing application inspired by Zoom. It enables users to create or join video call rooms directly from the browser — no plugins or downloads required.

The app uses **WebRTC** for peer-to-peer video/audio streaming and **Socket.io** for real-time signaling between peers. Users can register and log in to access their meeting history, or join instantly as a guest using a room code.

---

## 🚀 Live Demo

| Service | URL |
|---|---|
| 🖥️ Frontend | [https://zoom-call-1-qt88.onrender.com](https://zoom-call-1-qt88.onrender.com) |
| ⚙️ Backend API | [https://zoom-call-fmpg.onrender.com](https://zoom-call-fmpg.onrender.com) |

> **Note:** Both services are hosted on Render's free tier. The server may take 30–60 seconds to wake up on first load.

---

## ✅ Features

- 🔐 **User Authentication** — Register and login with secure bcrypt password hashing and JWT token-based sessions
- 👤 **Guest Access** — Join any room instantly as a guest without creating an account
- 📹 **Real-Time Video Calls** — Peer-to-peer HD video streaming powered by WebRTC
- 🔗 **Room-Based Sessions** — Create a room and share the unique room code with anyone to start a call
- 🔇 **Mute / Unmute** — Toggle your microphone on or off during a call
- 📷 **Camera Toggle** — Turn your camera on or off at any time
- 🖥️ **Screen Sharing** — Share your screen with all participants in the room
- 📋 **Meeting History** — Logged-in users can view a history of all their past meetings

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React.js | 18.2.0 | UI framework |
| React Router DOM | 6.21.1 | Client-side routing |
| Socket.io-client | 4.7.3 | Real-time signaling |
| MUI (Material UI) | 5.15.4 | UI components |
| Axios | 1.6.5 | HTTP requests |
| Lucide React | 1.21.0 | Icons |
| WebRTC | Native Browser API | Peer-to-peer video/audio |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | — | Runtime environment |
| Express.js | 4.18.2 | REST API server |
| Socket.io | 4.7.3 | WebRTC signaling server |
| MongoDB + Mongoose | 8.0.3 | Database + ODM |
| bcrypt | 5.1.1 | Password hashing |
| cors | 2.8.5 | Cross-origin requests |
| http-status | 1.7.3 | HTTP status codes |

### Database
- **MongoDB Atlas** — Cloud-hosted NoSQL database

### Deployment
- **Render** — Frontend and backend both deployed on Render

---

## 📁 Project Structure

```
Zoom_call-/
│
├── frontend/                        # React.js frontend
│   ├── public/
│   │   ├── index.html               # HTML entry point + favicon
│   │   └── mobile.png               # Hero section image
│   │
│   ├── src/
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx      # Auth state, login, register, history
│   │   │
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx      # Public landing page with hero + footer
│   │   │   ├── Authentication.jsx   # Login / Register page (tab-based)
│   │   │   ├── HomeComponent.jsx    # Dashboard — create/join room
│   │   │   ├── VideoMeet.jsx        # Live video call room (WebRTC)
│   │   │   └── History.jsx          # Meeting history page
│   │   │
│   │   ├── utils/
│   │   │   └── withAuth.jsx         # HOC — protects authenticated routes
│   │   │
│   │   ├── App.js                   # Route definitions
│   │   ├── App.css                  # Global styles (dark theme)
│   │   └── index.js                 # React DOM entry point
│   │
│   ├── package.json
│   └── .env                         # REACT_APP_SERVER_URL
│
├── backend/                         # Node.js + Express backend
│   ├── src/
│   │   ├── app.js                   # Express app entry point
│   │   ├── routes/
│   │   │   └── users.routes.js      # Auth + activity routes
│   │   │
│   │   ├── controllers/
│   │   │   └── user.controller.js   # Register, login, history logic
│   │   │
│   │   ├── models/
│   │   │   ├── user.model.js        # User schema (name, username, password)
│   │   │   └── meeting.model.js     # Meeting history schema
│   │   │
│   │   └── connectDB/
│   │       └── index.js             # MongoDB Atlas connection
│   │
│   ├── package.json
│   └── .env                         # PORT, MONGO_URI, JWT_SECRET
│
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have these installed:
- [Node.js](https://nodejs.org/) v16+
- [npm](https://www.npmjs.com/) v8+
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier works)
- [Git](https://git-scm.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/ishapatidar32/Zoom_call-
cd Zoom_call-
```

---

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=8000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Backend runs at: `http://localhost:8000`

---

### 3. Setup Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file inside the `frontend` folder:

```env
REACT_APP_SERVER_URL=http://localhost:8000
```

Start the frontend:

```bash
npm start
```

Frontend runs at: `http://localhost:3000`

---

## 🔑 Environment Variables

### Backend `/backend/.env`

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `8000` |
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT tokens | `mysecretkey123` |

### Frontend `/frontend/.env`

| Variable | Description | Example |
|---|---|---|
| `REACT_APP_SERVER_URL` | Backend API base URL | `https://zoom-call-fmpg.onrender.com` |

---

## 📡 API Endpoints

Base URL: `https://zoom-call-fmpg.onrender.com/api/v1/users`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/register` | Register a new user | ❌ |
| `POST` | `/login` | Login and receive JWT token | ❌ |
| `GET` | `/get_all_activity` | Get meeting history of user | ✅ Token |
| `POST` | `/add_to_activity` | Save a meeting code to history | ✅ Token |

---

## 🔄 How WebRTC Works in This App

```
User A                    Signaling Server               User B
  |                        (Socket.io)                     |
  |--- join room --------->|                               |
  |                        |<-------- join room -----------|
  |<-- user joined --------|                               |
  |                                                        |
  |--- offer (SDP) ------->|------- offer (SDP) --------->|
  |<-- answer (SDP) -------|<------ answer (SDP) ---------|
  |--- ICE candidate ----->|------ ICE candidate -------->|
  |<-- ICE candidate ------|<----- ICE candidate ----------|
  |                                                        |
  |<=================== P2P Video Stream ================>|
```

1. Both users join the same room via Socket.io
2. One peer creates an **SDP Offer** and sends it through the signaling server
3. The other peer responds with an **SDP Answer**
4. **ICE candidates** are exchanged to establish the best network path
5. Once connected, video/audio streams directly **peer-to-peer** (no server in between)

---

## 🚢 Deployment

Both frontend and backend are deployed on **Render**.

### Backend (Web Service)
| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Environment | Add all `.env` variables in Render dashboard |

### Frontend (Static Site)
| Setting | Value |
|---|---|
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Publish Directory | `build` |
| Environment | Add `REACT_APP_SERVER_URL` in Render dashboard |

---

## 👩‍💻 Author

**Isha Patidar**

- 🌐 Portfolio: [GitHub](https://github.com/ishapatidar32)
- 💼 LinkedIn: [LinkedIn](https://linkedin.com)
- 🧩 LeetCode: [LeetCode](https://leetcode.com)
- 📧 Email: ishapatidar61@gmail.com

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- [WebRTC API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API) — Browser-native P2P communication
- [Socket.io](https://socket.io/) — Real-time bidirectional event-based communication
- [Material UI](https://mui.com/) — React UI component library
- [Render](https://render.com/) — Cloud deployment platform
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) — Cloud database

---

<p align="center">Made with ❤️ by Isha Patidar</p>
