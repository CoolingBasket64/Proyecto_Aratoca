const db = require("../config/database");

const loginUsuario = (email, password) => {

  return new Promise((resolve, reject) => {

    const sql = "SELECT * FROM usuarios WHERE email = ? AND password = ?";

    db.query(sql, [email, password], (err, result) => {

      if (err) {
        reject(err);
      } else {
        resolve(result);
      }

    });

  });

};

module.exports = { loginUsuario };