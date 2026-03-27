const { obtenerPersonasDB } = require("../models/personaModel");
const { insertarPersonaDB } = require("../models/personaModel");
const { editarPersonaDB } = require("../models/personaModel");
const { cambiarEstadoPersonaDB } = require("../models/personaModel");

const obtenerPersonas = async (req, res) => {
  try {
    const personas = await obtenerPersonasDB();
    res.json(personas);
  } catch (error) {
    res.status(500).json(error);
  }
};

const crearPersona = async (req, res) => {
  try {
    const persona = req.body;
    const resultado = await insertarPersonaDB(persona);
    res.status(201).json({ mensaje: "Persona creada", id: resultado.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear persona" });
  }
};

const editarPersona = async (req, res) => {
  try {
    const id = req.params.id;
    const persona = req.body;
    const resultado = await editarPersonaDB(id, persona);
    res.json({ mensaje: "Persona actualizada", affectedRows: resultado.affectedRows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al editar persona" });
  }
};
const cambiarEstadoPersona = async (req, res) => {
  try {
    const id = req.params.id;
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

const { obtenerPersonaPorIdDB } = require("../models/personaModel");

const obtenerPersonaPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const persona = await obtenerPersonaPorIdDB(id);

    res.json(persona);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener persona" });
  }
};
module.exports = { obtenerPersonas, crearPersona, editarPersona, cambiarEstadoPersona, obtenerPersonaPorId };