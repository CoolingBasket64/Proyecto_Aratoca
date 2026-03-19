const db = require("../config/database");

const obtenerPersonasDB = () => {

    return new Promise((resolve, reject) => {

        const sql = `
                    SELECT p.id_persona, p.nombre_completo, p.edad, p.sexo, p.discapacidad,
                    u.sector, u.latitud, u.longitud
                    FROM personas_discapacidad p
                    JOIN ubicaciones u ON p.id_ubicacion = u.id_ubicacion
                    `;

        db.query(sql, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });

    });

};
const crearCuidador = (idPersona, cuidador) => {
  return new Promise((resolve, reject) => {
    const sqlBuscar = `
      SELECT id_cuidador FROM cuidadores
      WHERE cod_tipo_doc = ? AND documento = ?
    `;
    db.query(sqlBuscar, [cuidador.cod_tipo_doc, cuidador.documento], (err, result) => {
      if (err) return reject(err);

      if (result.length > 0) {
        // Si existe, usar el cuidador existente
        const idCuidadorExistente = result[0].id_cuidador;
        resolve(idCuidadorExistente);
      } else {
        // Si no existe, crear uno nuevo
        const nombreCompleto = `${cuidador.primer_nombre} ${cuidador.segundo_nombre} ${cuidador.primer_apellido} ${cuidador.segundo_apellido}`;
        const fechaNacimiento = new Date(cuidador.fecha_nacimiento);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        const mes = hoy.getMonth() - fechaNacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) edad--;

        const sqlInsert = `
          INSERT INTO cuidadores
          (id_persona, cod_tipo_doc, documento, primer_apellido, segundo_apellido,
           primer_nombre, segundo_nombre, nombre_completo, fecha_nacimiento, edad, sexo, parentesco, celular)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
          idPersona,
          cuidador.cod_tipo_doc,
          cuidador.documento,
          cuidador.primer_apellido,
          cuidador.segundo_apellido,
          cuidador.primer_nombre,
          cuidador.segundo_nombre,
          nombreCompleto,
          cuidador.fecha_nacimiento,
          edad,
          cuidador.sexo,
          cuidador.parentesco,
          cuidador.celular
        ];

        db.query(sqlInsert, values, (err2, resultInsert) => {
          if (err2) return reject(err2);
          resolve(resultInsert.insertId);
        });
      }
    });
  });
};

const insertarPersonaDB = (persona) => {
  return new Promise((resolve, reject) => {
    // Insertar ubicación
    const sqlUbicacion = `INSERT INTO ubicaciones (zona, vereda, sector, direccion) VALUES (?, ?, ?, ?)`;
    db.query(sqlUbicacion, [persona.zona, persona.vereda, persona.sector, persona.direccion], (err, resultUbicacion) => {
      if (err) return reject(err);
      const idUbicacion = resultUbicacion.insertId;

      const fechaNacimiento = new Date(persona.fecha_nacimiento);
      const hoy = new Date();
      let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
      const mes = hoy.getMonth() - fechaNacimiento.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) edad--;

      const iniciales = (persona.primer_nombre[0] || '') + (persona.segundo_nombre[0] || '') + (persona.primer_apellido[0] || '') + (persona.segundo_apellido[0] || '');
      const ultimos4 = persona.documento.slice(-4);
      const codigo = (iniciales + ultimos4).toUpperCase();

      const nombreCompleto = `${persona.primer_nombre} ${persona.segundo_nombre} ${persona.primer_apellido} ${persona.segundo_apellido}`;
      const sqlPersona = `
        INSERT INTO personas_discapacidad
        (codigo, rlcpd, cod_tipo_doc, documento, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
         nombre_completo, fecha_nacimiento, edad, sexo, discapacidad, celular, id_ubicacion)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const valuesPersona = [
        codigo,
        persona.rlcpd || null,
        persona.cod_tipo_doc,
        persona.documento,
        persona.primer_nombre,
        persona.segundo_nombre,
        persona.primer_apellido,
        persona.segundo_apellido,
        nombreCompleto,
        persona.fecha_nacimiento,
        edad,
        persona.sexo,
        persona.discapacidad,
        persona.celular,
        idUbicacion
      ];

      db.query(sqlPersona, valuesPersona, async (err2, resultPersona) => {
        if (err2) return reject(err2);
        const idPersona = resultPersona.insertId;

        // Insertar cuidador si aplica
        if (persona.tiene_cuidador && persona.cuidador) {
          try {
            const idCuidador = await crearCuidador(idPersona, persona.cuidador);
            resolve({ persona: resultPersona, idCuidador });
          } catch (errCuidador) {
            reject(errCuidador);
          }
        } else {
          resolve({ persona: resultPersona });
        }
      });
    });
  });
};

const editarPersonaDB = (id, persona) => {
    return new Promise((resolve, reject) => {
        const sql = `
      UPDATE personas_discapacidad SET
      documento = ?, primer_nombre = ?, segundo_nombre = ?, primer_apellido = ?, segundo_apellido = ?,
      fecha_nacimiento = ?, sexo = ?, discapacidad = ?, celular = ?, zona = ?, vereda = ?, sector = ?, direccion = ?
      WHERE id_persona = ?
    `;
        const values = [
            persona.documento,
            persona.primer_nombre,
            persona.segundo_nombre,
            persona.primer_apellido,
            persona.segundo_apellido,
            persona.fecha_nacimiento,
            persona.sexo,
            persona.discapacidad,
            persona.celular,
            persona.zona,
            persona.vereda,
            persona.sector,
            persona.direccion,
            id
        ];

        db.query(sql, values, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

const inactivarPersonaDB = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `
      UPDATE personas_discapacidad SET activo = 0
      WHERE id_persona = ?
    `;
        db.query(sql, [id], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

module.exports = { obtenerPersonasDB, insertarPersonaDB, editarPersonaDB, inactivarPersonaDB };