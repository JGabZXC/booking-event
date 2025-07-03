import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.js";
import { HTTPSTATUS } from "./config/http.js";

import ticketRoute from "./routes/ticketRoute.js";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";

const app = express();

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use(express.json());
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
app.use(/.*/, (req, res) => {
  res.status(HTTPSTATUS.NOT_FOUND).json({
    status: "fail",
    message: "Route not found",
  });
});

app.use(errorHandler);

export default app;
