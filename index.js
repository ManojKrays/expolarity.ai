const express = require("express");
const cors = require("cors");
const careerRoutes = require("./src/routes/careerRoutes");
const connectDB = require("./src/config/db");
require("dotenv").config();
const app = express();

// Allowed origins
const allowedOrigins = [
  "http://panel.expolarity.ai",
  "https://panel.expolarity.ai",
  "http://localhost:5173",
];

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  credentials: true, // Allow cookies and authentication headers
};

app.use(cors(corsOptions));

// connectDB();
app.use(express.json());

app.use("/api/careers", careerRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Career service running on port ${PORT}`));
