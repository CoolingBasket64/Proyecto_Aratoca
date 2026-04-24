// Importa la aplicacion Express ya configurada con rutas y middlewares desde app.js.
// La separacion en dos archivos (app.js y server.js) es una buena practica:
// app.js define la aplicacion, server.js la arranca.
const app = require('./src/app');

// process.env.PORT es la variable que plataformas como Vercel o Heroku definen automaticamente
// para indicar en que puerto debe escuchar el servidor.
// Si no existe esa variable (ambiente local), usamos 7800 como puerto por defecto.
const PORT = process.env.PORT || 7800;

// app.listen() pone el servidor a escuchar peticiones entrantes en el puerto indicado.
// El callback se ejecuta una sola vez cuando el servidor arranca exitosamente.
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
