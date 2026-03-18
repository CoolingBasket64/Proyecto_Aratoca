const express = require("express");
const router = express.Router();

const { 
  obtenerPersonas,
  crearPersona,
  editarPersona,
  inactivarPersona
} = require("../controllers/personaController");

router.get("/", obtenerPersonas);
router.post("/", crearPersona);
router.put("/:id", editarPersona);
router.patch("/:id/inactivar", inactivarPersona);

module.exports = router;