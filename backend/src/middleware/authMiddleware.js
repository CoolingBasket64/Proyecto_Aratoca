// jsonwebtoken es la libreria que permite crear y verificar tokens JWT.
// JWT (JSON Web Token) es un estandar para transmitir informacion de forma segura entre cliente y servidor.
// Un token tiene 3 partes separadas por puntos: header.payload.firma
//   - header:  tipo de token y algoritmo de cifrado (ej: HS256)
//   - payload: datos que queremos guardar dentro del token (id_usuario, email, rol)
//   - firma:   garantia criptografica de que el token no fue modificado despues de crearse
const jwt = require("jsonwebtoken");

// Un middleware en Express es una funcion que se ejecuta ENTRE que llega la peticion
// y que el controlador la procesa. Sirve para validar, transformar o rechazar peticiones.
// Recibe siempre (req, res, next):
//   - req:  objeto con toda la informacion de la peticion (headers, body, params, etc.)
//   - res:  objeto con el que enviamos la respuesta al cliente
//   - next: funcion que le dice a Express "todo OK, continua con el siguiente paso"
const verificarToken = (req, res, next) => {

  // El cliente envia el token en el header HTTP llamado "Authorization".
  // El formato estandar es: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  // "Bearer" es el tipo de autenticacion (significa "portador del token")
  const authHeader = req.headers["authorization"];

  // Si el header existe, split(" ") lo divide en ["Bearer", "<token>"] y tomamos el indice [1]
  // El operador && es "cortocircuito": si authHeader es undefined, no intenta el split y token queda undefined
  const token = authHeader && authHeader.split(" ")[1];

  // Si no hay token en la peticion, respondemos con 401 (No Autorizado)
  // 401 = "no autenticado": el servidor no sabe quien eres
  if (!token) {
    return res.status(401).json({ mensaje: "Acceso denegado. Se requiere autenticacion." });
  }

  try {
    // jwt.verify hace dos verificaciones:
    //   1. Que el token fue firmado con JWT_SECRET (demuestra que lo genero nuestro servidor, no alguien externo)
    //   2. Que el token no ha expirado (segun el expiresIn que se definio al crearlo)
    // Si pasa ambas, retorna el payload: los datos que se guardaron cuando se genero el token en el login
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Guardamos los datos del usuario decodificados en req.usuario
    // para que cualquier controlador que venga despues pueda saber quien hizo la peticion
    req.usuario = decoded;

    // next() le dice a Express que todo esta bien y que siga con el controlador de la ruta
    next();

  } catch {
    // Si jwt.verify lanza un error significa que el token es invalido o ya expiro.
    // 403 = "Prohibido": el servidor te conoce pero no tienes permiso para acceder
    return res.status(403).json({ mensaje: "Token invalido o expirado." });
  }
};

module.exports = verificarToken;
