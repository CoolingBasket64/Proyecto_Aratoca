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
      sector: "Centro"
    },
    {
      id: 2,
      nombre: "María Gómez",
      edad: 25,
      genero: "Femenino",
      tipoDiscapacidad: "Auditiva",
      sector: "Norte"
    }
  ]);
});

module.exports = router;