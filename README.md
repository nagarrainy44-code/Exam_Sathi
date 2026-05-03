<div align="center">

![Exam Saathi Banner](assets/banner.png)

# 🎓 Exam Saathi

### *Your Ultimate Academic Excellence Partner*

[![Build Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)](https://github.com/nagarrainy44-code/Exam_Sathi)
[![React](https://img.shields.io/badge/Frontend-React%20%7C%20Vite-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

**Exam Saathi** is a premium, full-stack government exam preparation platform designed to provide students with a seamless, high-performance learning experience. Built with a focus on modern aesthetics and robust functionality, it serves as a comprehensive tool for managing study materials, tracking progress, and acing exams.

</div>

## ✨ Key Features

### 🏛️ Ivory Excellence UI
Experience a professional, high-contrast interface designed for long study sessions.
- **Glassmorphic Design**: Modern, translucent UI elements.
- **Academic Palette**: Soothing ivory background with deep slate and amber accents.
- **Premium Typography**: Utilizing *Outfit* and *Inter* fonts for maximum readability.

### 📊 Advanced Dashboard
- **Real-time Analytics**: Visualize your progress with Chart.js integration.
- **Interactive Progress Tracking**: Keep tabs on your study goals with intuitive checkmarks.

### 📚 Study Material Hub
- **Multi-format Support**: Seamlessly upload and view PDFs and images.
- **React-PDF Integration**: Read notes directly within the application.
- **Cloud-ready Storage**: Efficient file management with Multer.

### ✍️ Interactive Quizzes
- **Instant Feedback**: Take practice tests and get results immediately.
- **Subject-wise Categories**: Focused preparation for different exam modules.

### 🔔 Smart Notifications
- **Real-time Alerts**: Stay updated on exam dates and new materials via Socket.io.
- **Email Integration**: Critical updates delivered straight to your inbox via Nodemailer.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router, Axios, Chart.js, React-PDF |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Real-time** | Socket.io |
| **Authentication** | JWT, Bcrypt.js |
| **Styling** | Vanilla CSS (Custom Design System) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (Local or Atlas)
- **NPM** or **Yarn**

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/nagarrainy44-code/Exam_Sathi.git
   cd exam-saathi
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   # Create a .env file and add your credentials (MONGO_URI, JWT_SECRET, etc.)
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

---

## 📂 Project Structure

```bash
exam-saathi/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Auth & Global state
│   │   ├── pages/          # Full-page views (Dashboard, Quiz, etc.)
│   │   ├── services/       # API integration (Axios)
│   │   └── styles/         # Ivory Excellence design tokens
│   └── index.html
└── server/                 # Node.js Backend
    ├── config/             # DB and App configuration
    ├── controllers/        # Business logic
    ├── models/             # Mongoose schemas
    ├── routes/             # API endpoints
    └── server.js           # Entry point
```

---

## 👤 Author

**Rainy Nagar**
- Full-Stack Developer

---

<div align="center">
  <p>Made with ❤️ for Students</p>
</div>
