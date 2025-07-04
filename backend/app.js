import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import playlist from "./modules/playlist.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://y-tracker.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS policy blocked request from origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("YTracker backend is up 🚀");
});

app.use("/api", playlist);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
