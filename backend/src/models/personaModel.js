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

const insertarPersonaDB = (persona) => {
    return new Promise((resolve, reject) => {
        const sqlUbicacion = `
      INSERT INTO ubicaciones (zona, vereda, sector, direccion)
      VALUES (?, ?, ?, ?)
    `;
        const valuesUbicacion = [
            persona.zona,
            persona.vereda,
            persona.sector,
            persona.direccion
        ];

        db.query(sqlUbicacion, valuesUbicacion, (err, resultUbicacion) => {
            if (err) return reject(err);

            const idUbicacion = resultUbicacion.insertId;
            const iniciales = (persona.primer_nombre[0] || '') + (persona.segundo_nombre[0] || '') + (persona.primer_apellido[0] || '') + (persona.segundo_apellido[0] || '');
            const ultimos4 = persona.documento.slice(-4);
            const codigo = (iniciales + ultimos4).toUpperCase();

            const sqlPersona = `
                                INSERT INTO personas_discapacidad
                                (codigo, cod_tipo_doc, documento, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
                                nombre_completo, fecha_nacimiento, sexo, discapacidad, celular, id_ubicacion)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                                `;

            const nombreCompleto = `${persona.primer_nombre} ${persona.segundo_nombre} ${persona.primer_apellido} ${persona.segundo_apellido}`;
            const valuesPersona = [
                codigo,
                persona.cod_tipo_doc,
                persona.documento,
                persona.primer_nombre,
                persona.segundo_nombre,
                persona.primer_apellido,
                persona.segundo_apellido,
                nombreCompleto,
                persona.fecha_nacimiento,
                persona.sexo,
                persona.discapacidad,
                persona.celular,
                idUbicacion
            ];

            db.query(sqlPersona, valuesPersona, (err2, resultPersona) => {
                if (err2) return reject(err2);
                resolve(resultPersona);
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