const express = require("express");
const router = express.Router();
const verificarToken = require("../middleware/authMiddleware");

const { login, crearAdmin, cambiarEstadoAdmin, obtenerAdmins, editarAdmin, obtenerAdminPorId } = require("../controllers/usuarioController");

// Ruta publica: no requiere token
router.post("/login", login);

// Todas las rutas debajo requieren autenticacion
router.use(verificarToken);

router.post("/", crearAdmin);
router.patch("/:id/estado", cambiarEstadoAdmin);
router.get("/", obtenerAdmins);
router.put("/:id", editarAdmin);
router.get("/:id", obtenerAdminPorId);

module.exports = router;
