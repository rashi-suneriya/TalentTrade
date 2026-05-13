# TalentTrade — Peer-to-Peer Learning & Skill Exchange

TalentTrade is a production-ready full-stack web application designed for people to exchange skills, enroll in video courses, and learn with the help of an AI Tutor.

## ✨ Features

- **Peer-to-Peer Swapping**: Propose, accept, and complete skill exchanges with other users.
- **Video Courses**: High-quality video learning with progress tracking.
- **AI Tutor**: Lesson-specific assistance powered by OpenAI GPT-4o.
- **Real-Time Features**: Notifications and messaging powered by Socket.io.
- **Token Economy**: Earn tokens by teaching or completing swaps.
- **Premium Design**: Modern, responsive UI with Dark Mode support.

## 🛠️ Tech Stack

**Frontend:**
- React 18 + Vite
- TailwindCSS (Styling)
- Framer Motion (Animations)
- Zustand (State Management)
- Socket.io-client (Real-time)

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- OpenAI SDK (AI Tutor)
- Cloudinary (Media Hosting)
- Nodemailer (Email Alerts)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (Local or Atlas)
- Cloudinary Account
- OpenAI API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd talenttrade
   ```

2. **Setup Backend:**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Fill in your .env values
   npm run dev
   ```

3. **Setup Frontend:**
   ```bash
   cd ../client
   npm install
   # Update VITE_API_URL in .env if needed
   npm run dev
   ```

4. **Seed Database:**
   ```bash
   cd server
   node seed/seed.js
   ```

## 🔑 Environment Variables

**Server:**
- `MONGO_URI`: Your MongoDB connection string.
- `JWT_SECRET`: Secret for Access Tokens.
- `JWT_REFRESH_SECRET`: Secret for Refresh Tokens.
- `OPENAI_API_KEY`: Your OpenAI API key.
- `CLOUDINARY_*`: Your Cloudinary credentials.
- `EMAIL_*`: SMTP settings for Nodemailer.

**Client:**
- `VITE_API_URL`: Backend API URL (default: http://localhost:5000/api).
- `VITE_SOCKET_URL`: Socket.io server URL (default: http://localhost:5000).

## 📄 License

MIT License. Created by Antigravity.
