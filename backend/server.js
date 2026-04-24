// Importa la aplicacion Express configurada en app.js
const app = require('./src/app');

// Define el puerto: primero busca una variable de entorno PORT,
// si no existe usa 7800 por defecto
const PORT = process.env.PORT || 7800;

// Inicia el servidor y lo pone a escuchar peticiones en el puerto definido
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
