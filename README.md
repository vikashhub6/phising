# 🎣 PhishSim - Spear Phishing Simulator (MERN Stack)

A full-stack security awareness training tool built with MongoDB, Express, React, Node.js.

## 📁 Project Structure

```
spear-phishing-mern/
├── backend/         ← Node.js + Express API
└── frontend/        ← React App
```

## ⚙️ Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and fill in:
- `MONGO_URI` - your MongoDB connection string
- `JWT_SECRET` - any random string
- `OPENAI_API_KEY` - from platform.openai.com
- `EMAIL_USER` - your Gmail address
- `EMAIL_PASS` - Gmail App Password (not your real password!)

> **Gmail App Password**: Go to Google Account → Security → 2-Step Verification → App Passwords → Generate

```bash
npm run dev
```

Backend runs on: http://localhost:5000

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on: http://localhost:3000

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🔐 Auth | Register / Login with JWT |
| 🎯 Targets | Add targets with name, email, company, job title |
| 🤖 AI Email | Generate personalized phishing emails using GPT |
| 📧 Send Email | Send via Gmail (Nodemailer) |
| 👁 Track Opens | Invisible pixel tracks when email is opened |
| 🖱 Track Clicks | Link tracking redirects to awareness page |
| 📊 Dashboard | Stats — open rate, click rate, recent campaigns |

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/targets | Get all targets |
| POST | /api/targets | Create target |
| POST | /api/emails/generate | AI generate email |
| POST | /api/emails/send | Send email |
| GET | /api/emails/campaigns | All campaigns |
| GET | /api/track/open/:id | Email open pixel |
| GET | /api/track/click/:id | Link click tracker |
| GET | /api/dashboard/stats | Dashboard stats |

# phising

