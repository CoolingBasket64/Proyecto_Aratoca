// Los controladores son el puente entre las rutas y los modelos.
// Reciben la peticion HTTP (req), llaman al modelo correspondiente y envian la respuesta (res).
// Toda la logica de negocio (validaciones, transformaciones) vive aqui.
// Los modelos solo ejecutan SQL; los controladores deciden QUE hacer con los datos.
const {
  obtenerPersonasPublicasDB,
  obtenerPersonasDB,
  insertarPersonaDB,
  editarPersonaDB,
  cambiarEstadoPersonaDB
} = require("../models/personaModel");

// ─────────────────────────────────────────────────────────────────────────────
// OBTENER PERSONAS PUBLICAS (sin autenticacion)
// GET /api/personas/publico
// Devuelve solo los campos no sensibles para el mapa de la pagina de inicio.
// No incluye nombre, documento, celular ni datos del cuidador.
// ─────────────────────────────────────────────────────────────────────────────
const obtenerPersonasPublicas = async (req, res) => {
  try {
    const personas = await obtenerPersonasPublicasDB();
    res.json(personas);
  } catch (error) {
    res.status(500).json(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// OBTENER TODAS LAS PERSONAS (requiere autenticacion)
// GET /api/personas
// Devuelve todos los campos incluyendo datos sensibles. Solo para admins logueados.
// ─────────────────────────────────────────────────────────────────────────────
const obtenerPersonas = async (req, res) => {
  try {
    const personas = await obtenerPersonasDB();
    res.json(personas);
  } catch (error) {
    // Codigo 500 = error interno del servidor (algo fallo en la BD o en el codigo)
    res.status(500).json(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// CREAR PERSONA
// POST /api/personas
// req.body contiene todos los datos del formulario enviados por el frontend.
// ─────────────────────────────────────────────────────────────────────────────
const crearPersona = async (req, res) => {
  try {
    const persona = req.body;
    const resultado = await insertarPersonaDB(persona);
    // 201 = "Created": codigo HTTP estandar para recursos creados exitosamente.
    // resultado.persona.insertId es el ID auto-generado por MySQL para el nuevo registro.
    res.status(201).json({ mensaje: "Persona creada", id: resultado.persona.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear persona" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// EDITAR PERSONA
// PUT /api/personas/:id
// req.params.id captura el segmento dinamico :id de la URL (ej: /api/personas/5 -> id = "5")
// ─────────────────────────────────────────────────────────────────────────────
const editarPersona = async (req, res) => {
  try {
    const id = req.params.id;
    const persona = req.body;
    const resultado = await editarPersonaDB(id, persona);
    // affectedRows indica cuantas filas modifico el UPDATE en la base de datos.
    // Si es 0, el ID no existe; si es 1, la actualizacion fue exitosa.
    res.json({ mensaje: "Persona actualizada", affectedRows: resultado.affectedRows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al editar persona" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// CAMBIAR ESTADO DE UNA PERSONA (activar/inactivar)
// PATCH /api/personas/:id/inactivar
// Se usa PATCH porque solo se actualiza un campo (activo), no el registro completo.
// ─────────────────────────────────────────────────────────────────────────────
const cambiarEstadoPersona = async (req, res) => {
  try {
    const id = req.params.id;
    // Desestructuracion: extrae solo "estado" y "razon" de req.body, ignorando el resto
    const { estado, razon } = req.body;

    const resultado = await cambiarEstadoPersonaDB(id, estado, razon);

    res.json({
      mensaje: "Estado actualizado correctamente",
      affectedRows: resultado.affectedRows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al cambiar estado" });
  }
};

// Se importan aqui porque se agregaron despues de las primeras importaciones
const { obtenerPersonaPorIdDB, buscarCuidadorPorDocumentoDB } = require("../models/personaModel");

// ─────────────────────────────────────────────────────────────────────────────
// OBTENER PERSONA POR ID
// GET /api/personas/:id
// Devuelve todos los datos de una persona incluyendo ubicacion y cuidador anidado.
// ─────────────────────────────────────────────────────────────────────────────
const obtenerPersonaPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const persona = await obtenerPersonaPorIdDB(id);
    res.json(persona);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener persona" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// BUSCAR CUIDADOR POR DOCUMENTO
// GET /api/personas/cuidador/:documento
// Permite al formulario de creacion buscar si ya existe un cuidador con ese documento
// para autocompletar sus datos y evitar duplicados.
// ─────────────────────────────────────────────────────────────────────────────
const buscarCuidadorPorDocumento = async (req, res) => {
  try {
    const { documento } = req.params;
    const cuidador = await buscarCuidadorPorDocumentoDB(documento);
    // 404 = "Not Found": el cuidador no existe, el frontend lo manejara mostrando el formulario vacio
    if (!cuidador) return res.status(404).json({ mensaje: "Cuidador no encontrado" });
    res.json(cuidador);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al buscar cuidador" });
  }
};

module.exports = {
  obtenerPersonasPublicas,
  obtenerPersonas,
  crearPersona,
  editarPersona,
  cambiarEstadoPersona,
  obtenerPersonaPorId,
  buscarCuidadorPorDocumento
};
