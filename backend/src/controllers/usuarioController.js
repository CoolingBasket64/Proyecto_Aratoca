// bcrypt es una libreria para hashear (cifrar) contrasenas de forma segura
// Nunca se guarda la contrasena en texto plano en la base de datos
const bcrypt = require("bcrypt");
const { loginUsuario, crearAdminDB, cambiarEstadoAdminDB, editarAdminDB, obtenerAdminPorIdDB } = require("../models/usuarioModel");

const login = async (req, res) => {
  // Extrae email y password del cuerpo de la peticion
  const { email, password } = req.body;

  try {
    // Busca en la base de datos si existe un usuario con ese email
    const result = await loginUsuario(email);

    // Si no hay resultados, el usuario no existe
    if (result.length === 0) {
      return res.status(401).json({
        mensaje: "Usuario o contrasena incorrectos"
      });
    }

    const usuario = result[0];

    // bcrypt.compare compara la contrasena que escribio el usuario
    // con el hash guardado en la base de datos sin descifrarlo
    // Retorna true si coinciden, false si no
    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return res.status(401).json({
        mensaje: "Usuario o contrasena incorrectos"
      });
    }

    // Solo retorna los datos necesarios del usuario, nunca la contrasena
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

    // Valida que todos los campos sean obligatorios antes de continuar
    if (!nombre || !email || !password) {
      return res.status(400).json({
        mensaje: "Todos los campos son obligatorios"
      });
    }

    // Valida que la contrasena tenga minimo 6 caracteres
    if (password.length < 6) {
      return res.status(400).json({
        mensaje: "La contrasena debe tener minimo 6 caracteres"
      });
    }

    // Hashea la contrasena antes de guardarla
    // El numero 10 es el "costo" del algoritmo: entre mas alto, mas seguro pero mas lento
    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = {
      nombre,
      email,
      password: hashedPassword // Se guarda el hash, nunca la contrasena original
    };

    const resultado = await crearAdminDB(nuevoUsuario);

    res.status(201).json({
      mensaje: "Administrador creado correctamente",
      id: resultado.insertId
    });

  } catch (error) {
    console.error(error);
    // ER_DUP_ENTRY es el codigo de error de MySQL cuando se intenta insertar un valor duplicado
    // en una columna con restriccion UNIQUE (como el email)
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        mensaje: "El correo ya esta registrado"
      });
    }

    res.status(500).json({
      mensaje: "Error al crear administrador"
    });
  }
};

// Se importa aqui porque fue agregado despues del bloque inicial de importaciones
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
    console.error("ERROR CAMBIAR ESTADO:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

const editarAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, password } = req.body;

    // Siempre se actualiza nombre y email
    let usuarioActualizado = {
      nombre,
      email
    };

    // La contrasena es opcional en edicion: solo se actualiza si el usuario escribio una nueva
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

    // Si no encuentra el admin, responde con 404
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
