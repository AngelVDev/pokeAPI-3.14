const { Router } = require("express");
const { allInfo } = require("../controllers/pokeController.js");
const { Op } = require("sequelize");
const { Pokemon, Type } = require("../db");
const router = Router();

router.get("/pokemons", async (req, res) => {
  try {
    const { name } = req.query;
    let full = Pokemon.findAll({include:{model: Type}})
    const info = await allInfo();
    if(!full.length) return await Pokemon.bulkCreate(info)
    if (name) {
      const pokeName = await Pokemon.findAll({
        where: { name: { [Op.iLike]: `%${name}%` } },
      });
      pokeName
        ? res.status(200).json(pokeName)
        : res.status(404).json("NOT FOUND");
    } else {
      let full = await Pokemon.findAll({ include: { model: Type } });
      res.status(200).json(full);
    }
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});
router.get("/pokemons/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (id) {
      const pokeById = await Pokemon.findByPk(id, {
        include: { model: Type },
      });
      !pokeById
        ? res.status(404).send("ID NOT FOUND")
        : res.status(200).json(pokeById);
    }
  } catch (error) {
    console.log(error);
  }
});
router.post("/pokemons", async (req, res) => {
  const { name, HP, attack, defense, speed, height, weight, types } = req.body;
  try {
    const pokeNew = await Pokemon.create({
      name,
      HP,
      attack,
      height,
      weight,
      defense,
      speed,
    });
    const typeDb = await Type.findAll({ where: { name: types } });
    await pokeNew.addType(typeDb);
    console.log(typeDb);
    res.status(201).json(pokeNew);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});
router.get("/:id/delete", async (req, res) => {
  try {
    await Pokemon.destroy({
      where: { id: req.params.id },
    });
    return res.status(204).json({ msg: "Poke-destroyed" });
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});
module.exports = router;
