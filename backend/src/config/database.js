const mysql = require("mysql2");
const dotenv = require("dotenv");

// Carga las variables de entorno desde el archivo .env
// Estas variables guardan datos sensibles como usuario y contraseña de la base de datos
// sin tener que escribirlos directamente en el codigo
dotenv.config();

// Crea la conexion a la base de datos usando las variables de entorno
const db = mysql.createConnection({
  host: process.env.DB_HOST,         // Direccion del servidor de base de datos (ej: localhost)
  user: process.env.DB_USER,         // Usuario de MySQL
  password: process.env.DB_PASSWORD, // Contrasena de MySQL
  database: process.env.DB_NAME,     // Nombre de la base de datos a usar
  port: process.env.DB_PORT          // Puerto de MySQL (por defecto 3306)
});

// Intenta conectarse a la base de datos
// El callback recibe un error si la conexion falla
db.connect((err) => {
  if (err) {
    console.error("Error conexion MySQL:", err);
    return;
  }
  console.log("Conectado a MySQL");
});

// Exporta la conexion para que los modelos puedan hacer consultas
module.exports = db;
