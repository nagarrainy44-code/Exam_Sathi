# Exam Saathi - Government Exam Preparation Platform

## Prerequisites
- Node.js 18+ installed
- MongoDB installed and running

## Setup

### 1. Install MongoDB (if not installed)
```bash
brew install mongodb-community
brew services start mongodb-community
```

### 2. Start Backend
```bash
cd server
npm run dev
```
Server runs on: `http://localhost:5001`

### 3. Start Frontend
```bash
cd client
npm run dev
```
Frontend runs on: `http://localhost:5173`

## Project Structure
```
exam-saathi/
├── server/              # Express Backend
│   ├── config/         # Database config
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Auth, upload middleware
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   └── uploads/        # Local file storage
│
└── client/             # React Frontend
    ├── src/
    │   ├── components/ # UI components
    │   ├── context/    # Auth context
    │   ├── pages/      # Page components
    │   ├── services/   # API calls
    │   └── styles/     # Government theme CSS
    └── index.html
```

## Features
- User authentication (Login/Signup)
- Profile management (Name, Course, Semester)
- Study materials (PDF/Image upload, view, download)
- Progress tracking with checkmarks
- Quiz practice with instant results
- Exam timetable
- Admin panel for content management

## Default Admin
Create an admin user by manually setting `role: "admin"` in MongoDB or via API.
