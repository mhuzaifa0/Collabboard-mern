# CollabBoard 📋

A real-time collaborative project management tool (Trello-style) built with the MERN stack.

## Features

- 🔐 User authentication (JWT + bcrypt)
- 📋 Create boards, lists, and cards
- 🖱️ Drag & drop cards between lists
- ⚡ Real-time updates via Socket.io (see changes live across users)
- 👥 Invite team members to boards
- 💬 Comments and due dates on cards
- 🔍 Search & filter cards

## Tech Stack

**Frontend:** React, React Router, Context API, Axios, Tailwind CSS
**Backend:** Node.js, Express, MongoDB (Mongoose), Socket.io
**Auth:** JWT (JSON Web Tokens)
**Deployment:** Vercel/Netlify (client) + Render/Railway (server) + MongoDB Atlas (DB)

## Project Structure

```
collabboard-mern/
├── client/          # React frontend
└── server/          # Express backend
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repo
```bash
git clone https://github.com/your-username/collabboard-mern.git
cd collabboard-mern
```

### 2. Setup the backend
```bash
cd server
npm install
cp .env.example .env
# Fill in your MongoDB URI and JWT secret in .env
npm run dev
```

### 3. Setup the frontend
```bash
cd client
npm install
npm start
```

Backend runs on `http://localhost:5000`
Frontend runs on `http://localhost:3000`

## Environment Variables (server/.env)

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
CLIENT_URL=http://localhost:3000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/boards | Get user's boards |
| POST | /api/boards | Create a board |
| GET | /api/boards/:id | Get single board with lists & cards |
| POST | /api/lists | Create a list |
| POST | /api/cards | Create a card |
| PUT | /api/cards/:id | Update/move a card |
| DELETE | /api/cards/:id | Delete a card |

## Screenshots

_Add screenshots/GIF of your app here after running it!_

## Future Improvements

- File attachments on cards
- Activity log per board
- Email notifications
- Dark mode

## License

MIT
