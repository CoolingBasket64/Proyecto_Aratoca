const db = require("../config/database");

// Los modelos son los encargados de comunicarse directamente con la base de datos
// Cada funcion retorna una Promesa (Promise) porque las consultas SQL son operaciones
// asincronas: no sabemos cuanto tardaran, entonces en lugar de bloquear el servidor,
// se "promete" que cuando termine se entregara el resultado (resolve) o un error (reject)

const loginUsuario = (email) => {
  return new Promise((resolve, reject) => {

    // El signo ? es un parametro preparado: evita inyeccion SQL
    // MySQL remplaza el ? con el valor de [email] de forma segura
    const sql = "SELECT * FROM usuarios WHERE email = ?";

    db.query(sql, [email], (err, result) => {
      if (err) {
        reject(err); // Si hay error, rechaza la promesa
      } else {
        resolve(result); // Si todo bien, retorna los resultados
      }
    });

  });
};

const crearAdminDB = (usuario) => {
  return new Promise((resolve, reject) => {

    const sql = `
      INSERT INTO usuarios (nombre, email, password, rol)
      VALUES (?, ?, ?, 'admin')
    `;

    // Los valores se pasan como array en el mismo orden que los signos ?
    db.query(
      sql,
      [usuario.nombre, usuario.email, usuario.password],
      (err, result) => {
        if (err) return reject(err);
        // result.insertId contiene el ID auto-generado del nuevo registro
        resolve(result);
      }
    );

  });
};

const obtenerAdminsDB = () => {
  return new Promise((resolve, reject) => {

    // Solo se seleccionan los campos necesarios, nunca la contrasena
    const sql = `
      SELECT id_usuario, nombre, email, estado
      FROM usuarios
      WHERE rol = 'admin'
    `;

    db.query(sql, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });

  });
};

const cambiarEstadoAdminDB = (id, estado) => {
  return new Promise((resolve, reject) => {

    console.log("DB -> ID:", id);
    console.log("DB -> Estado:", estado);

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

const editarAdminDB = (id, usuario) => {
  return new Promise((resolve, reject) => {

    // La query SQL se construye dinamicamente:
    // si se envio contrasena nueva se agrega ", password = ?" al UPDATE,
    // si no se envio contrasena esa parte se omite con un string vacio
    const sql = `
      UPDATE usuarios
      SET nombre = ?, email = ?
      ${usuario.password ? ", password = ?" : ""}
      WHERE id_usuario = ?
    `;

    // Los parametros tambien cambian segun si hay contrasena o no
    const params = usuario.password
      ? [usuario.nombre, usuario.email, usuario.password, id]
      : [usuario.nombre, usuario.email, id];

    db.query(sql, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });

  });
};

const obtenerAdminPorIdDB = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT id_usuario, nombre, email FROM usuarios WHERE id_usuario = ?";

    db.query(sql, [id], (err, result) => {
      if (err) return reject(err);
      // result es un array, [0] toma solo el primer (y unico) resultado
      resolve(result[0]);
    });
  });
};

module.exports = { loginUsuario, crearAdminDB, cambiarEstadoAdminDB, obtenerAdminsDB, editarAdminDB, obtenerAdminPorIdDB };
