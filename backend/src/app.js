const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", async (req, res) => {
  res.json({
    status: "online",
  });
});

app.use("/api", routes);

module.exports = app;
