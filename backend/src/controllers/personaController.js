// Importa las funciones del modelo que ejecutan las consultas SQL
const { obtenerPersonasDB } = require("../models/personaModel");
const { insertarPersonaDB } = require("../models/personaModel");
const { editarPersonaDB } = require("../models/personaModel");
const { cambiarEstadoPersonaDB } = require("../models/personaModel");

// Los controladores son funciones que reciben la peticion (req) y envian la respuesta (res)
// req contiene todo lo que manda el cliente: parametros, cuerpo, headers, etc.
// res es el objeto con el que respondemos al cliente

const obtenerPersonas = async (req, res) => {
  try {
    // Llama al modelo para obtener todas las personas de la base de datos
    const personas = await obtenerPersonasDB();
    // Responde con la lista en formato JSON
    res.json(personas);
  } catch (error) {
    // Si ocurre un error en la base de datos, responde con codigo 500 (error del servidor)
    res.status(500).json(error);
  }
};

const crearPersona = async (req, res) => {
  try {
    // req.body contiene los datos enviados por el frontend en formato JSON
    const persona = req.body;
    const resultado = await insertarPersonaDB(persona);
    // Responde con codigo 201 (creado exitosamente) y el ID del nuevo registro
    res.status(201).json({ mensaje: "Persona creada", id: resultado.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear persona" });
  }
};

const editarPersona = async (req, res) => {
  try {
    // req.params.id captura el valor del segmento :id de la URL (ej: /api/personas/5)
    const id = req.params.id;
    const persona = req.body;
    const resultado = await editarPersonaDB(id, persona);
    // affectedRows indica cuantas filas fueron modificadas en la base de datos
    res.json({ mensaje: "Persona actualizada", affectedRows: resultado.affectedRows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al editar persona" });
  }
};

const cambiarEstadoPersona = async (req, res) => {
  try {
    const id = req.params.id;
    // Desestructura del cuerpo de la peticion solo las propiedades que necesita
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

const obtenerPersonaPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const persona = await obtenerPersonaPorIdDB(id);
    res.json(persona);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener persona" });
  }
};

const buscarCuidadorPorDocumento = async (req, res) => {
  try {
    // El documento viene como parametro en la URL: /api/personas/cuidador/123456
    const { documento } = req.params;
    const cuidador = await buscarCuidadorPorDocumentoDB(documento);
    // Si no existe el cuidador, responde con 404 (no encontrado)
    if (!cuidador) return res.status(404).json({ mensaje: "Cuidador no encontrado" });
    res.json(cuidador);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al buscar cuidador" });
  }
};

// Exporta todas las funciones para que las rutas puedan usarlas
module.exports = { obtenerPersonas, crearPersona, editarPersona, cambiarEstadoPersona, obtenerPersonaPorId, buscarCuidadorPorDocumento };
