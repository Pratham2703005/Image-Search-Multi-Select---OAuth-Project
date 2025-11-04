import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
import "./config/passport.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import searchRoutes from "./routes/search.js";
import historyRoutes from "./routes/history.js";

dotenv.config();
const app = express();

// Trust proxy
app.set('trust proxy', 1);

// Connect to database first
connectDB();

// CORS headers middleware (must be before CORS)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigin = process.env.CLIENT_URL?.replace(/\/$/, '');
  
  if (origin === allowedOrigin) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  }
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// CORS
app.use(cors({ 
  origin: process.env.CLIENT_URL?.replace(/\/$/, ''),
  credentials: true 
}));

app.use(express.json());

// Session with MongoStore
app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    touchAfter: 24 * 3600
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
    domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", searchRoutes);
app.use("/api", historyRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));