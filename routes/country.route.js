const CountryRouter = require("express").Router()
const { isAuth, isAdmin } = require("../middlewares/auth.middleware")
const { updateCountry, deleteCountry, createCountry, getCountry, getCountries } = require("../controllers/country.controller")

CountryRouter.get('/countries', getCountries);
CountryRouter.get('/countries/:id', getCountry);
CountryRouter.post('/countries', isAuth, isAdmin, createCountry);
CountryRouter.put('/countries/:id', isAuth, isAdmin, updateCountry);
CountryRouter.delete('/countries/:id', isAuth, isAdmin, deleteCountry);



module.exports = CountryRouter