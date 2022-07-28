const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const poke = require("./pokeRoute");
const type = require("./typeRoute");

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use("/", poke);
router.use("/", type);

module.exports = router;
