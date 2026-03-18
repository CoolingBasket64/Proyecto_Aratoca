const { obtenerPersonasDB } = require("../models/personaModel");
const { insertarPersonaDB } = require("../models/personaModel");
const { editarPersonaDB } = require("../models/personaModel");

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

const { inactivarPersonaDB } = require("../models/personaModel");

const inactivarPersona = async (req, res) => {
  try {
    const id = req.params.id;
    const resultado = await inactivarPersonaDB(id);
    res.json({ mensaje: "Persona inactivada", affectedRows: resultado.affectedRows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al inactivar persona" });
  }
};
module.exports = { obtenerPersonas, crearPersona, editarPersona, inactivarPersona };