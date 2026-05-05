const db = require("../config/database");

const obtenerPersonasPublicasDB = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        p.id_persona,
        p.codigo,
        p.edad,
        p.sexo,
        p.discapacidad,
        p.rlcpd,
        p.tiene_cuidador,
        p.activo,
        u.zona,
        u.vereda,
        u.cod_sector,
        u.sector,
        u.barrio
      FROM personas_discapacidad p
      JOIN ubicaciones u ON p.id_ubicacion = u.id_ubicacion
    `;
    db.query(sql, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

const obtenerPersonasDB = () => {
  return new Promise((resolve, reject) => {

    const sql = `
      SELECT
        p.id_persona,
        p.codigo,
        p.cod_tipo_doc,
        t.descripcion_min,
        p.documento,
        p.primer_nombre,
        p.segundo_nombre,
        p.primer_apellido,
        p.segundo_apellido,
        p.nombre_completo,
        p.fecha_nacimiento,
        p.edad,
        p.sexo,
        p.discapacidad,
        p.celular,
        p.rlcpd,
        p.tiene_cuidador,
        p.activo,
        u.zona,
        u.vereda,
        u.cod_sector,
        u.sector,
        u.barrio,
        c.cod_tipo_doc        AS cuidador_cod_tipo_doc,
        tc.descripcion_min    AS cuidador_descripcion_min,
        c.primer_nombre       AS cuidador_primer_nombre,
        c.segundo_nombre      AS cuidador_segundo_nombre,
        c.primer_apellido     AS cuidador_primer_apellido,
        c.segundo_apellido    AS cuidador_segundo_apellido,
        c.nombre_completo     AS cuidador_nombre,
        c.documento           AS cuidador_documento,
        c.fecha_nacimiento    AS cuidador_fecha_nacimiento,
        c.parentesco          AS cuidador_parentesco,
        c.celular             AS cuidador_celular,
        c.sexo                AS cuidador_sexo,
        c.edad                AS cuidador_edad
      FROM personas_discapacidad p
      JOIN ubicaciones u  ON u.id_ubicacion  = p.id_ubicacion
      LEFT JOIN ttipo_doc t  ON t.cod_tipo_doc  = p.cod_tipo_doc
      LEFT JOIN cuidadores c ON c.id_persona    = p.id_persona
      LEFT JOIN ttipo_doc tc ON tc.cod_tipo_doc = c.cod_tipo_doc;
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

// Busca un cuidador por tipo de documento y numero de documento
// Si ya existe lo reutiliza, si no existe lo crea
const crearCuidador = (idPersona, cuidador) => {
  return new Promise((resolve, reject) => {
    const sqlBuscar = `
      SELECT id_cuidador FROM cuidadores
      WHERE cod_tipo_doc = ? AND documento = ?
    `;
    db.query(sqlBuscar, [cuidador.cod_tipo_doc, cuidador.documento], (err, result) => {
      if (err) return reject(err);

      if (result.length > 0) {
        // El cuidador ya existe en la base de datos, usa su ID sin crear duplicado
        const idCuidadorExistente = result[0].id_cuidador;
        resolve(idCuidadorExistente);
      } else {
        // El cuidador no existe, se crea uno nuevo
        const nombreCompleto = `${cuidador.primer_nombre} ${cuidador.segundo_nombre} ${cuidador.primer_apellido} ${cuidador.segundo_apellido}`;

        // Calcula la edad a partir de la fecha de nacimiento
        const fechaNacimiento = new Date(cuidador.fecha_nacimiento);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        const mes = hoy.getMonth() - fechaNacimiento.getMonth();
        // Si aun no ha pasado el mes de cumpleanos este anio, se resta un ano
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
          // insertId es el ID generado automaticamente por MySQL para el nuevo registro
          resolve(resultInsert.insertId);
        });
      }
    });
  });
};

// Actualiza el cuidador de una persona si ya tiene uno, o lo crea si no tiene
const actualizarCuidador = (idPersona, cuidador) => {
  return new Promise((resolve, reject) => {

    // Primero verifica si ya existe un cuidador para esta persona
    const sqlBuscar = `SELECT id_cuidador FROM cuidadores WHERE id_persona = ?`;

    db.query(sqlBuscar, [idPersona], (err, result) => {
      if (err) return reject(err);

      const nombreCompleto = `${cuidador.primer_nombre} ${cuidador.segundo_nombre} ${cuidador.primer_apellido} ${cuidador.segundo_apellido}`;

      // Calcula la edad del cuidador
      const fechaNacimiento = new Date(cuidador.fecha_nacimiento);
      const hoy = new Date();
      let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
      const mes = hoy.getMonth() - fechaNacimiento.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) edad--;

      if (result.length > 0) {
        // Ya existe un cuidador para esta persona: se actualiza
        const sqlUpdate = `
          UPDATE cuidadores SET
            cod_tipo_doc=?,
            documento=?,
            primer_nombre=?,
            segundo_nombre=?,
            primer_apellido=?,
            segundo_apellido=?,
            nombre_completo=?,
            fecha_nacimiento=?,
            edad=?,
            sexo=?,
            parentesco=?,
            celular=?
          WHERE id_persona=?
        `;

        db.query(sqlUpdate, [
          cuidador.cod_tipo_doc,
          cuidador.documento,
          cuidador.primer_nombre,
          cuidador.segundo_nombre,
          cuidador.primer_apellido,
          cuidador.segundo_apellido,
          nombreCompleto,
          cuidador.fecha_nacimiento,
          edad,
          cuidador.sexo,
          cuidador.parentesco,
          cuidador.celular,
          idPersona
        ], (err2, result2) => {
          if (err2) return reject(err2);
          resolve(result2);
        });

      } else {
        // No existe cuidador para esta persona: se crea uno nuevo
        crearCuidador(idPersona, cuidador)
          .then(resolve)
          .catch(reject);
      }

    });
  });
};

const insertarPersonaDB = (persona) => {
  return new Promise((resolve, reject) => {

    // Primero se inserta la ubicacion y se obtiene su ID
    // para luego asociarlo a la persona
    const sqlUbicacion = `INSERT INTO ubicaciones (zona, vereda, sector, direccion) VALUES (?, ?, ?, ?)`;
    db.query(sqlUbicacion, [persona.zona, persona.vereda, persona.sector, persona.direccion], (err, resultUbicacion) => {
      if (err) return reject(err);
      const idUbicacion = resultUbicacion.insertId;

      // Calcula la edad de la persona a partir de su fecha de nacimiento
      const fechaNacimiento = new Date(persona.fecha_nacimiento);
      const hoy = new Date();
      let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
      const mes = hoy.getMonth() - fechaNacimiento.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) edad--;

      // Genera el codigo unico: iniciales de los 4 nombres/apellidos + ultimos 4 digitos del documento
      // Ejemplo: "Juan Carlos Perez Gomez" con doc 123456 -> "JCPG3456"
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
      const valoresPersona = [
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

      // Se usa async dentro del callback para poder usar await con crearCuidador
      db.query(sqlPersona, valoresPersona, async (err2, resultPersona) => {
        if (err2) return reject(err2);
        const idPersona = resultPersona.insertId;

        // Solo crea el cuidador si la persona tiene cuidador y se enviaron sus datos
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

    // Primero actualiza la ubicacion usando una subconsulta para encontrar
    // el id_ubicacion asociado a esta persona sin necesitar otro query previo
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

      // Luego actualiza los datos de la persona
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
            // Si tiene cuidador: actualiza o crea segun si ya existia
            await actualizarCuidador(id, persona.cuidador);
          } else {
            // Si ya no tiene cuidador: elimina el registro de cuidador si existia
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

    // Si se esta inactivando (estado=0) guarda la razon, si se activa limpia la razon
    const razonFinal = estado === 0 ? razon : "";

    db.query(sql, [estado, razonFinal, id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });

  });
};

// Obtiene todos los datos de una persona incluyendo ubicacion y cuidador
const obtenerPersonaPorIdDB = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        p.*,
        u.zona, u.vereda, u.sector, u.direccion,
        c.id_cuidador,
        c.cod_tipo_doc AS cuidador_cod_tipo_doc,
        c.documento    AS cuidador_documento,
        c.primer_nombre  AS cuidador_primer_nombre,
        c.segundo_nombre AS cuidador_segundo_nombre,
        c.primer_apellido  AS cuidador_primer_apellido,
        c.segundo_apellido AS cuidador_segundo_apellido,
        c.fecha_nacimiento AS cuidador_fecha_nacimiento,
        c.sexo       AS cuidador_sexo,
        c.parentesco AS cuidador_parentesco,
        c.celular    AS cuidador_celular
      FROM personas_discapacidad p
      LEFT JOIN ubicaciones u ON p.id_ubicacion = u.id_ubicacion
      LEFT JOIN cuidadores c ON p.id_persona = c.id_persona
      WHERE p.id_persona = ?
    `;

    db.query(sql, [id], (err, result) => {
      if (err) return reject(err);

      if (result.length === 0) return resolve(null);

      const row = result[0];

      // Reestructura el resultado: si hay cuidador (id_cuidador no es null)
      // lo agrupa en un objeto anidado "cuidador", de lo contrario queda null
      // El operador spread (...row) copia todas las propiedades del resultado original
      const persona = {
        ...row,
        cuidador: row.id_cuidador
          ? {
              cod_tipo_doc:    row.cuidador_cod_tipo_doc,
              documento:       row.cuidador_documento,
              primer_nombre:   row.cuidador_primer_nombre,
              segundo_nombre:  row.cuidador_segundo_nombre,
              primer_apellido: row.cuidador_primer_apellido,
              segundo_apellido:row.cuidador_segundo_apellido,
              fecha_nacimiento:row.cuidador_fecha_nacimiento,
              sexo:            row.cuidador_sexo,
              parentesco:      row.cuidador_parentesco,
              celular:         row.cuidador_celular
            }
          : null
      };

      resolve(persona);
    });
  });
};

// Busca un cuidador por numero de documento para autocompletar el formulario
const buscarCuidadorPorDocumentoDB = (documento) => {
  return new Promise((resolve, reject) => {
    // LIMIT 1 asegura que solo retorne un resultado aunque haya varios coincidentes
    const sql = `SELECT * FROM cuidadores WHERE documento = ? LIMIT 1`;
    db.query(sql, [documento], (err, result) => {
      if (err) return reject(err);
      // Si encontro resultados retorna el primero, si no retorna null
      resolve(result.length > 0 ? result[0] : null);
    });
  });
};

module.exports = { obtenerPersonasPublicasDB, obtenerPersonasDB, insertarPersonaDB, editarPersonaDB, cambiarEstadoPersonaDB, obtenerPersonaPorIdDB, buscarCuidadorPorDocumentoDB };
