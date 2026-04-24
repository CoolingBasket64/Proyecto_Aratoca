const express = require("express");
const router = express.Router();

// Importa las funciones del controlador de usuarios
const { login, crearAdmin, cambiarEstadoAdmin, obtenerAdmins, editarAdmin, obtenerAdminPorId } = require("../controllers/usuarioController");

// POST /api/usuarios/login -> autentica al usuario con email y contrasena
router.post("/login", login);

// POST /api/usuarios -> crea un nuevo administrador
router.post("/", crearAdmin);

// PATCH /api/usuarios/:id/estado -> activa o inactiva un administrador
router.patch("/:id/estado", cambiarEstadoAdmin);

// GET /api/usuarios -> retorna la lista de todos los administradores
router.get("/", obtenerAdmins);

// PUT /api/usuarios/:id -> edita los datos de un administrador
router.put("/:id", editarAdmin);

// GET /api/usuarios/:id -> retorna los datos de un administrador por su ID
router.get("/:id", obtenerAdminPorId);

module.exports = router;
