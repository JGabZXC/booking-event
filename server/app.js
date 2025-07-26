import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./src/middlewares/errorHandler.js";

import ticketRoute from "./src/routes/ticketRoute.js";
import authRoute from "./src/routes/authRoute.js";
import userRoute from "./src/routes/userRoute.js";

const app = express();

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use("/api/v1/tickets", ticketRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);

app.use(errorHandler);

export default app;
