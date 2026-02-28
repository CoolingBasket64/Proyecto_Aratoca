const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json([
    {
      id: 1,
      nombre: "Carlos Pérez",
      edad: 30,
      genero: "Masculino",
      tipoDiscapacidad: "Visual",
      sector: "Centro",
      latitud: 6.6996,
      longitud: -73.0181,
    },
    {
      id: 2,
      nombre: "María Gómez",
      edad: 25,
      genero: "Femenino",
      tipoDiscapacidad: "Auditiva",
      sector: "Norte",
      latitud: 6.701,
      longitud: -73.020,
    }
  ]);
});

module.exports = router;