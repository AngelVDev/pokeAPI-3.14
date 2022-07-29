const axios = require("axios");
const { Pokemon, Type } = require("../db");

const pokeApi = async () => {
  function capitalize(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
  try {
    const pokeData = [];
    const pokeUrl = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=151`);
    const urlP = await pokeUrl.data;
    const pokesUrl = await urlP.results.map((el) => el.url);
    pokeData.push(axios.get(pokesUrl))
    const allPk = Promise.all(pokeData).then((pk) => {
      let pokeArray = pk.map((poke) => {
        return {
          id: poke.data.id,
          name: capitalize(poke.data.name),
          types: [
            poke.data.types[0].type.name,
            poke.data.types[1] ? poke.data.types[1].type.name : null,
          ].filter(Boolean),
          image: poke.data.sprites.other["official-artwork"].front_default,
          HP: poke.data.stats[0].base_stat,
          attack: poke.data.stats[1].base_stat,
          defense: poke.data.stats[2].base_stat,
          speed: poke.data.stats[5].base_stat,
          weight: poke.data.weight,
          height: poke.data.height,
        };
      });
      return pokeArray;
    });
    return await allPk;
  } catch (err) {
    console.log(err)
  }
};

const pokeDB = async () => {
  const service = await Pokemon.findAll({ include: Type });
  return service;
};

const allInfo = async () => {
  const api = await pokeApi();
  const db = await pokeDB();
  const all = api.concat(db);
  return all;
};
module.exports = { allInfo };
