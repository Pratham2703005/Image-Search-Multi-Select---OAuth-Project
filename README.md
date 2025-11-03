# 🔍 MERN Image Search & Multi-Select

A full-stack image search application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring OAuth authentication and Unsplash API integration.

## 📸 Screenshots

### 1. Landing Page (Unauthenticated)
![Landing Page](./public/Screenshot%202025-11-03%20210604.png)
*Users are prompted to log in to access search functionality*

### 2. OAuth Login Panel
![Login Panel](./public/Screenshot%202025-11-03%20210616.png)
*Multiple OAuth providers: Google, Facebook, and GitHub*

### 3. Dashboard (Authenticated)
![Dashboard](./public/Screenshot%202025-11-03%20210633.png)
*Top searches banner and search interface*

### 4. Search Results with Multi-Select
![Search Results](./public/Screenshot%202025-11-03%20210659.png)
*Image grid with multi-select checkboxes and counter*

---

## ✨ Features

- 🔐 **OAuth Authentication** - Login via Google, Facebook, or GitHub using Passport.js
- 🔍 **Image Search** - Search high-quality images using Unsplash API
- 📊 **Top Searches** - View the 5 most popular search terms across all users
- ✅ **Multi-Select Grid** - Select multiple images with checkboxes and dynamic counter
- 📜 **Search History** - Personal search history with timestamps for each user
- 🎨 **Responsive Design** - 4-column grid layout that adapts to screen sizes

---

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **Axios** - HTTP requests
- **React Router** - Navigation
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Passport.js** - Authentication middleware

### APIs
- **Unsplash API** - Image search
- **Google OAuth 2.0** - Google authentication
- **Facebook OAuth** - Facebook authentication
- **GitHub OAuth** - GitHub authentication

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Unsplash API Key
- OAuth credentials (Google, Facebook, GitHub)

### 1. Clone the Repository

```bash
git clone https://github.com/Pratham2703005/Image-Search-Multi-Select---OAuth-Project.git
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB
MONGO_URI=mongodb://localhost:27017/image-search

# Session Secret
SESSION_SECRET=your_session_secret_here

# Unsplash API
UNSPLASH_ACCESS_KEY=your_unsplash_access_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Facebook OAuth
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback

```

Start the backend server:

```bash
npm run dev
```

The server will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd client
npm install

```
Create a `.env` file in the `client` directory:
```env
VITE_SERVER_URL=http://localhost:5000
```

Start the React app:

```bash
npm run dev
```

The app will run on `http://localhost:5173`
