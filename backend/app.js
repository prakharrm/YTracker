import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import playlist from "./modules/playlist.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://y-tracker.vercel.app/"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/api", playlist);

app.listen(5000, () => {
  console.log("app running on port ", 5000);
});
