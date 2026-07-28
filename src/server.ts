import express from "express";
import { checkDatabaseConnection } from "./db.js";

const app = express();
const port = 3000;

app.get("/health", (_request, response) => {
  response.status(200).json({
    status: "ok",
  });
});

async function startServer(): Promise<void> {
  try {
    await checkDatabaseConnection();
    console.log("Database connection succeeded.");

    app.listen(port, () => {
      console.log(`Server is running on port ${port}.`);
    });
  } catch (error) {
    console.error("Database connection failed.", error);
    process.exit(1);
  }
}

void startServer();