const { obtenerPersonasDB } = require("../models/personaModel");

const obtenerPersonas = async (req, res) => {

  try {

    const personas = await obtenerPersonasDB();

    res.json(personas);

  } catch (error) {

    res.status(500).json({
      error: "Error obteniendo personas"
    });

  }

};

module.exports = { obtenerPersonas };