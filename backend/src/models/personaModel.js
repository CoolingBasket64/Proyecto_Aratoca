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

module.exports = { obtenerPersonasDB };