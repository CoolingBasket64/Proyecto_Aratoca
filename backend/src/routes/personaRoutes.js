const express = require("express");
const router = express.Router();

const {
  obtenerPersonas,
  crearPersona,
  editarPersona,
  cambiarEstadoPersona,
  obtenerPersonaPorId,
  buscarCuidadorPorDocumento
} = require("../controllers/personaController");

router.get("/", obtenerPersonas);
router.post("/", crearPersona);
router.put("/:id", editarPersona);
router.patch("/:id/inactivar", cambiarEstadoPersona);
router.get("/cuidador/:documento", buscarCuidadorPorDocumento);
router.get("/:id", obtenerPersonaPorId);

module.exports = router;