const app = require('./src/app');

const PORT = process.env.PORT || 7800;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 