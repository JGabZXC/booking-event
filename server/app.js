import express from "express";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorHandler.js";
import ticketRoute from "./routes/ticketRoute.js";
import { HTTPSTATUS } from "./config/http.js";

const app = express();

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use("/api/v1/tickets", ticketRoute);
app.use(/.*/, (req, res) => {
  res.status(HTTPSTATUS.NOT_FOUND).json({
    status: "fail",
    message: "Route not found",
  });
});

app.use(errorHandler);

export default app;
