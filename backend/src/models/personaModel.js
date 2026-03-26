const db = require("../config/database");

const obtenerPersonasDB = () => {

    return new Promise((resolve, reject) => {

        const sql = `
                    SELECT 
                      p.id_persona, 
                      p.documento,
                      p.nombre_completo, 
                      p.edad, 
                      p.sexo, 
                      p.discapacidad,
                      p.activo,
                      u.sector, 
                      u.latitud, 
                      u.longitud
                    FROM personas_discapacidad p
                    JOIN ubicaciones u ON p.id_ubicacion = u.id_ubicacion;
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
        nombre_completo, fecha_nacimiento, edad, sexo, discapacidad, celular, id_ubicacion, tiene_cuidador)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        idUbicacion,
        persona.tiene_cuidador
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

    const sqlUbicacion = `
      UPDATE ubicaciones 
      SET zona=?, vereda=?, sector=?, direccion=? 
      WHERE id_ubicacion = (
        SELECT id_ubicacion FROM personas_discapacidad WHERE id_persona = ?
      )
    `;

    db.query(sqlUbicacion, [
      persona.zona,
      persona.vereda,
      persona.sector,
      persona.direccion,
      id
    ], (err) => {
      if (err) return reject(err);

      const sqlPersona = `
        UPDATE personas_discapacidad SET
        documento = ?, 
        primer_nombre = ?, 
        segundo_nombre = ?, 
        primer_apellido = ?, 
        segundo_apellido = ?,
        fecha_nacimiento = ?, 
        sexo = ?, 
        discapacidad = ?, 
        celular = ?,
        tiene_cuidador = ?
        WHERE id_persona = ?
      `;

      db.query(sqlPersona, [
        persona.documento,
        persona.primer_nombre,
        persona.segundo_nombre,
        persona.primer_apellido,
        persona.segundo_apellido,
        persona.fecha_nacimiento,
        persona.sexo,
        persona.discapacidad,
        persona.celular,
        persona.tiene_cuidador,
        id
      ], async (err2, result) => {
        if (err2) return reject(err2);

        try {
          if (persona.tiene_cuidador && persona.cuidador) {

            await crearCuidador(id, persona.cuidador);

          } else {
            // eliminar cuidador si ya no tiene
            await new Promise((res, rej) => {
              db.query(
                "DELETE FROM cuidadores WHERE id_persona = ?",
                [id],
                (err3) => err3 ? rej(err3) : res()
              );
            });
          }

          resolve(result);

        } catch (error) {
          reject(error);
        }

      });
    });
  });
};

const cambiarEstadoPersonaDB = (id, estado, razon) => {
  return new Promise((resolve, reject) => {

    const sql = `
      UPDATE personas_discapacidad 
      SET activo = ?, 
          razon_estado = ?, 
          fecha_modificacion = NOW()
      WHERE id_persona = ?
    `;

    const razonFinal = estado === 0 ? razon : "";

    db.query(sql, [estado, razonFinal, id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });

  });
};

const obtenerPersonaPorIdDB = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        p.*,
        u.zona, u.vereda, u.sector, u.direccion,

        c.id_cuidador,
        c.cod_tipo_doc AS cuidador_cod_tipo_doc,
        c.documento AS cuidador_documento,
        c.primer_nombre AS cuidador_primer_nombre,
        c.segundo_nombre AS cuidador_segundo_nombre,
        c.primer_apellido AS cuidador_primer_apellido,
        c.segundo_apellido AS cuidador_segundo_apellido,
        c.fecha_nacimiento AS cuidador_fecha_nacimiento,
        c.sexo AS cuidador_sexo,
        c.parentesco AS cuidador_parentesco,
        c.celular AS cuidador_celular

      FROM personas_discapacidad p
      LEFT JOIN ubicaciones u ON p.id_ubicacion = u.id_ubicacion
      LEFT JOIN cuidadores c ON p.id_persona = c.id_persona
      WHERE p.id_persona = ?
    `;

    db.query(sql, [id], (err, result) => {
      if (err) return reject(err);

      if (result.length === 0) return resolve(null);

      const row = result[0];

      // 👇 estructurar como tu frontend espera
      const persona = {
        ...row,
        cuidador: row.id_cuidador
          ? {
              cod_tipo_doc: row.cuidador_cod_tipo_doc,
              documento: row.cuidador_documento,
              primer_nombre: row.cuidador_primer_nombre,
              segundo_nombre: row.cuidador_segundo_nombre,
              primer_apellido: row.cuidador_primer_apellido,
              segundo_apellido: row.cuidador_segundo_apellido,
              fecha_nacimiento: row.cuidador_fecha_nacimiento,
              sexo: row.cuidador_sexo,
              parentesco: row.cuidador_parentesco,
              celular: row.cuidador_celular
            }
          : null
      };

      resolve(persona);
    });
  });
};

module.exports = { obtenerPersonasDB, insertarPersonaDB, editarPersonaDB, cambiarEstadoPersonaDB, obtenerPersonaPorIdDB };