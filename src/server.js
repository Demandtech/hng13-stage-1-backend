import app from "./app.js";
import { connectDB } from "./db/index.js";
import StringModel from "./models/strings.model.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectDB();
  await StringModel.sync();

  app.listen(3000, () => {
    console.log("Server is running on port", PORT);
  });
}

startServer();
