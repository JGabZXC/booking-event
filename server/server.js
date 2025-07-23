import app from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: "./src/config/.env" });

const server = app;

const DB = process.env.MONGO_URL.replace(
  "<PASSWORD>",
  process.env.MONGO_PASSWORD
).replace("<USERNAME>", process.env.MONGO_USERNAME);

const LOCALHOSTDB = process.env.MONGO_LOCAL;

mongoose
  .connect(process.env.NODE_ENV === "production" ? DB : LOCALHOSTDB)
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
