const express = require("express");
const cors = require("cors");

const personaRoutes = require("./routes/personaRoutes");
const authRoutes = require("./routes/usuarioRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/personas", personaRoutes);
app.use("/api/usuarios", authRoutes);


app.get("/", (req, res) => {
  res.send("Server funcionando");
});

module.exports = app;