import express from "express";

const app = express();
const port = 3000;

app.get("/health", (_request, response) => {
  response.status(200).json({
    status: "ok",
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});