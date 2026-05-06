const db = require("../config/database");

// Los modelos son la capa de acceso a datos: son los unicos archivos que ejecutan SQL.
// Cada funcion retorna una Promesa (Promise) porque las consultas SQL son asincronas.
// Una Promesa tiene dos posibles resultados:
//   - resolve(valor): la operacion tuvo exito, entrega el resultado
//   - reject(error):  la operacion fallo, entrega el error para que el controlador lo maneje

// ─────────────────────────────────────────────────────────────────────────────
// BUSCAR USUARIO POR EMAIL (para el login)
// ─────────────────────────────────────────────────────────────────────────────
const loginUsuario = (email) => {
  return new Promise((resolve, reject) => {

    // El signo ? es un "parametro preparado" (prepared statement).
    // MySQL reemplaza el ? con el valor del array [email] de forma segura,
    // escapando caracteres especiales para prevenir inyeccion SQL.
    // Inyeccion SQL: tecnica de ataque donde se insertan comandos SQL en los inputs.
    const sql = "SELECT * FROM usuarios WHERE email = ?";

    db.query(sql, [email], (err, result) => {
      if (err) reject(err);
      else     resolve(result); // result es un array de filas; si el email no existe, es []
    });
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// CREAR ADMINISTRADOR
// ─────────────────────────────────────────────────────────────────────────────
const crearAdminDB = (usuario) => {
  return new Promise((resolve, reject) => {

    // El rol siempre es 'admin' porque este modelo solo crea administradores.
    // Los valores de usuario.* vienen hasheados desde el controlador.
    const sql = `
      INSERT INTO usuarios (nombre, email, password, rol)
      VALUES (?, ?, ?, 'admin')
    `;

    // Los valores se pasan como array en el mismo orden que los signos ?
    db.query(sql, [usuario.nombre, usuario.email, usuario.password], (err, result) => {
      if (err) return reject(err);
      resolve(result); // result.insertId tiene el ID auto-generado del nuevo registro
    });
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// OBTENER TODOS LOS ADMINISTRADORES
// ─────────────────────────────────────────────────────────────────────────────
const obtenerAdminsDB = () => {
  return new Promise((resolve, reject) => {

    // Solo se seleccionan los campos necesarios para la lista.
    // NUNCA se incluye "password" en consultas de listado: principio de minimo privilegio.
    const sql = `
      SELECT id_usuario, nombre, email, estado
      FROM usuarios
      WHERE rol = 'admin'
    `;

    db.query(sql, (err, result) => {
      if (err) reject(err);
      else     resolve(result);
    });
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// CAMBIAR ESTADO DE UN ADMINISTRADOR (activar/inactivar)
// ─────────────────────────────────────────────────────────────────────────────
const cambiarEstadoAdminDB = (id, estado) => {
  return new Promise((resolve, reject) => {

    const sql = "UPDATE usuarios SET estado = ? WHERE id_usuario = ?";

    db.query(sql, [estado, id], (err, result) => {
      if (err) {
        console.error("ERROR SQL:", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// EDITAR ADMINISTRADOR
// ─────────────────────────────────────────────────────────────────────────────
const editarAdminDB = (id, usuario) => {
  return new Promise((resolve, reject) => {

    // La query SQL se construye dinamicamente:
    // si se envio contrasena nueva se agrega ", password = ?" al UPDATE,
    // si no se envio contrasena esa parte se omite con un string vacio.
    // Template literals (backtick ``) permiten escribir SQL en varias lineas y usar ${...}
    const sql = `
      UPDATE usuarios
      SET nombre = ?, email = ?
      ${usuario.password ? ", password = ?" : ""}
      WHERE id_usuario = ?
    `;

    // Los parametros tambien cambian segun si hay contrasena o no.
    // El orden debe coincidir exactamente con el orden de los ? en la query.
    const params = usuario.password
      ? [usuario.nombre, usuario.email, usuario.password, id]
      : [usuario.nombre, usuario.email, id];

    db.query(sql, params, (err, result) => {
      if (err) reject(err);
      else     resolve(result);
    });
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// OBTENER ADMINISTRADOR POR ID
// ─────────────────────────────────────────────────────────────────────────────
const obtenerAdminPorIdDB = (id) => {
  return new Promise((resolve, reject) => {
    // No incluimos password en el SELECT por seguridad
    const sql = "SELECT id_usuario, nombre, email FROM usuarios WHERE id_usuario = ?";

    db.query(sql, [id], (err, result) => {
      if (err) return reject(err);
      // result es un array. [0] toma el primer (y unico) resultado.
      // Si no existe el ID, result[0] sera undefined y el controlador devuelve 404.
      resolve(result[0]);
    });
  });
};

module.exports = { loginUsuario, crearAdminDB, cambiarEstadoAdminDB, obtenerAdminsDB, editarAdminDB, obtenerAdminPorIdDB };
