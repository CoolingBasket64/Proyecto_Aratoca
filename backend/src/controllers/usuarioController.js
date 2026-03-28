const bcrypt = require("bcrypt");
const { loginUsuario, crearAdminDB, cambiarEstadoAdminDB, editarAdminDB, obtenerAdminPorIdDB } = require("../models/usuarioModel");

const login = async (req, res) => {

  const { email, password } = req.body;

  try {

    const result = await loginUsuario(email);

    if (result.length === 0) {
      return res.status(401).json({
        mensaje: "Usuario o contraseña incorrectos"
      });
    }

    const usuario = result[0];
    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return res.status(401).json({
        mensaje: "Usuario o contraseña incorrectos"
      });
    }

    res.json({
      mensaje: "Login exitoso",
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error en el servidor"
    });

  }

};

const crearAdmin = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        mensaje: "Todos los campos son obligatorios"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        mensaje: "La contraseña debe tener mínimo 6 caracteres"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = {
      nombre,
      email,
      password: hashedPassword
    };

    const resultado = await crearAdminDB(nuevoUsuario);

    res.status(201).json({
      mensaje: "Administrador creado correctamente",
      id: resultado.insertId
    });

  } catch (error) {
    console.error(error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        mensaje: "El correo ya está registrado"
      });
    }

    res.status(500).json({
      mensaje: "Error al crear administrador"
    });
  }
};

const { obtenerAdminsDB } = require("../models/usuarioModel");

const obtenerAdmins = async (req, res) => {
  try {
    const admins = await obtenerAdminsDB();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ mensaje: "Error obteniendo administradores" });
  }
};

const cambiarEstadoAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    console.log("ID:", id);
    console.log("Estado:", estado);

    await cambiarEstadoAdminDB(id, estado);

    res.json({ mensaje: "Estado actualizado" });

  } catch (error) {
    console.error("ERROR CAMBIAR ESTADO:", error); // 👈 AQUÍ
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

const editarAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, password } = req.body;

    let usuarioActualizado = {
      nombre,
      email
    };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      usuarioActualizado.password = hashedPassword;
    }

    await editarAdminDB(id, usuarioActualizado);

    res.json({
      mensaje: "Administrador actualizado correctamente"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al actualizar administrador"
    });
  }
};

const obtenerAdminPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await obtenerAdminPorIdDB(id);

    if (!admin) {
      return res.status(404).json({
        mensaje: "Administrador no encontrado"
      });
    }

    res.json(admin);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error obteniendo administrador"
    });
  }
};


module.exports = { login, crearAdmin, cambiarEstadoAdmin, obtenerAdmins, editarAdmin, obtenerAdminPorId };