const CountryRouter = require("express").Router()
const { newCountry, getCountries } = require("../controllers/country.controller")

CountryRouter.get('/countries', getCountries);
CountryRouter.post('/countries', newCountry);



module.exports = CountryRouter