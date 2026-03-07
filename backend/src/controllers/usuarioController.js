const { loginUsuario } = require("../models/usuarioModel");

const login = async (req, res) => {

  const { email, password } = req.body;

  try {

    const result = await loginUsuario(email, password);

    if (result.length === 0) {
      return res.status(401).json({
        mensaje: "Usuario o contraseña incorrectos"
      });
    }

    res.json({
      mensaje: "Login exitoso",
      usuario: result[0]
    });

  } catch (error) {

    res.status(500).json({
      mensaje: "Error en el servidor"
    });

  }

};

module.exports = { login };