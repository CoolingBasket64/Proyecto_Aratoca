const express = require("express");
const router = express.Router();

const { obtenerPersonas } = require("../controllers/personaController");

router.get("/", obtenerPersonas);

module.exports = router;