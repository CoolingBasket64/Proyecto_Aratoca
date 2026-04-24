// mysql2 es el driver (conector) que permite a Node.js hablar con una base de datos MySQL.
// Es asincrono y soporta tanto callbacks como Promesas.
const mysql = require("mysql2");

// dotenv lee el archivo .env y carga sus variables en process.env
// Esto permite separar la configuracion sensible (contrasenas, claves) del codigo fuente.
// Nunca se sube el .env a git; en produccion las variables se configuran directamente en el servidor.
const dotenv = require("dotenv");
dotenv.config();

// createConnection crea un objeto de conexion con los datos del servidor MySQL.
// Cada propiedad viene de una variable de entorno para no escribir credenciales en el codigo.
const db = mysql.createConnection({
  host:     process.env.DB_HOST,      // Direccion del servidor MySQL (ej: "localhost" o una IP en la nube)
  user:     process.env.DB_USER,      // Usuario de MySQL (ej: "root")
  password: process.env.DB_PASSWORD,  // Contrasena del usuario MySQL
  database: process.env.DB_NAME,      // Nombre de la base de datos a usar (ej: "aratoca_db")
  port:     process.env.DB_PORT       // Puerto de MySQL, por defecto es 3306
});

// db.connect() intenta abrir la conexion con el servidor.
// Si falla (credenciales incorrectas, servidor apagado, etc.) imprime el error y el servidor no arranca.
// Si tiene exito, imprime un mensaje de confirmacion.
db.connect((err) => {
  if (err) {
    console.error("Error conexion MySQL:", err);
    return;
  }
  console.log("Conectado a MySQL");
});

// Exportamos el objeto de conexion para que los modelos puedan usarlo y hacer consultas SQL.
// Al exportar una sola instancia, todos los archivos comparten la misma conexion (patron Singleton).
module.exports = db;
