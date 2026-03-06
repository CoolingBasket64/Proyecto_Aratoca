const db = require("./config/database");
const express = require("express");
const cors = require("cors");

const personaRoutes = require("./routes/personaRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/personas", personaRoutes);

app.get("/", (req, res) => {
  res.send("Server funcionando");
});

module.exports = app;