const express = require("express");
const router = express.Router();

// Importamos el middleware de autenticacion para proteger las rutas privadas.
const verificarToken = require("../middleware/authMiddleware");

// Importamos las funciones del controlador de usuarios.
const {
  login,              // Autentica con email/contrasena y devuelve un JWT
  crearAdmin,         // Crea un nuevo administrador con contrasena hasheada
  cambiarEstadoAdmin, // Activa o inactiva un administrador
  obtenerAdmins,      // Lista todos los administradores
  editarAdmin,        // Actualiza nombre, email y opcionalmente contrasena
  obtenerAdminPorId   // Devuelve los datos de un administrador especifico
} = require("../controllers/usuarioController");

// ─── RUTA PUBLICA ──────────────────────────────────────────────────────────────
// POST /api/usuarios/login
// Esta ruta no requiere token porque es el punto de entrada: el usuario aun no tiene token.
// Recibe email y password, los verifica y devuelve un JWT si las credenciales son correctas.
router.post("/login", login);

// ─── RUTAS PRIVADAS ────────────────────────────────────────────────────────────
// Todas las rutas definidas despues de esta linea requeriran un JWT valido.
// Si el token no existe, es invalido o expiro, el middleware responde con 401/403.
router.use(verificarToken);

// POST /api/usuarios -> crea un nuevo administrador (solo admins autenticados pueden hacerlo)
router.post("/", crearAdmin);

// PATCH /api/usuarios/:id/estado -> activa o inactiva un administrador
router.patch("/:id/estado", cambiarEstadoAdmin);

// GET /api/usuarios -> lista todos los administradores registrados
router.get("/", obtenerAdmins);

// PUT /api/usuarios/:id -> actualiza los datos de un administrador
router.put("/:id", editarAdmin);

// GET /api/usuarios/:id -> datos de un administrador especifico por su ID
router.get("/:id", obtenerAdminPorId);

module.exports = router;
