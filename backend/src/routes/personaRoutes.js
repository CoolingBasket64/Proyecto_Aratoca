const express = require("express");
const router = express.Router();

const { 
  obtenerPersonas,
  crearPersona,
  editarPersona,
  cambiarEstadoPersona,
  obtenerPersonaPorId
} = require("../controllers/personaController");

router.get("/", obtenerPersonas);
router.post("/", crearPersona);
router.put("/:id", editarPersona);
router.patch("/:id/inactivar", cambiarEstadoPersona);
router.get("/:id", obtenerPersonaPorId);

module.exports = router;