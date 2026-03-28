const db = require("../config/database");

const loginUsuario = (email) => {
  return new Promise((resolve, reject) => {

    const sql = "SELECT * FROM usuarios WHERE email = ?";

    db.query(sql, [email], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
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

    db.query(
      sql,
      [usuario.nombre, usuario.email, usuario.password],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );

  });
};

const obtenerAdminsDB = () => {
  return new Promise((resolve, reject) => {

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
        console.error("ERROR SQL:", err); // 👈 AQUÍ
        reject(err);
      } else {
        resolve(result);
      }
    });

  });
};

const editarAdminDB = (id, usuario) => {
  return new Promise((resolve, reject) => {

    const sql = `
      UPDATE usuarios
      SET nombre = ?, email = ?
      ${usuario.password ? ", password = ?" : ""}
      WHERE id_usuario = ?
    `;

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
      resolve(result[0]); // solo uno
    });
  });
};

module.exports = { loginUsuario, crearAdminDB, cambiarEstadoAdminDB, obtenerAdminsDB, editarAdminDB, obtenerAdminPorIdDB  };