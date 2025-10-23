import express from "express";
import stringRouter from "./routes/string.route.js";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const app = express();

app.use(express.json());
app.use("/strings", stringRouter);

app.get("/", (_, res) => {
  res.json({ message: "String Analyzer API running..." });
});

app.all(/(.*)/, (req, res) => {
    res.status(404).json({ message: `Route ${req.url} not found` });
  });

app.use((err, req, res, next) => {
  console.error(err);

  if (err instanceof ResponseStatusException) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      error: err.error || null,
    });
  }

  res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
  next()
});

export default app;
