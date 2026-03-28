const express = require("express");
const router = express.Router();

const { login, crearAdmin,cambiarEstadoAdmin, obtenerAdmins, editarAdmin, obtenerAdminPorId } = require("../controllers/usuarioController");

router.post("/login", login);
router.post("/", crearAdmin);
router.patch("/:id/estado", cambiarEstadoAdmin);
router.get("/", obtenerAdmins);
router.put("/:id", editarAdmin);
router.get("/:id", obtenerAdminPorId);

module.exports = router;