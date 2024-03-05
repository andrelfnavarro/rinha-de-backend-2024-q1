import express, { Application } from "express";

const PORT = process.env.PORT || 8080;
const container_id = process.env.HOSTNAME;

const app: Application = express();

app.get("/", async (_req, res) => {
  res.send({
    message: `Hello from ${container_id}!`,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${container_id}`);
});
