const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors');
const bodyParser = require("body-parser");
const pool = require('./connections/pool');
const AuthRouter = require('./routes/auth.route');
const SeedRouter = require('./routes/seedRoute');
const CountryRouter = require('./routes/countryRoute');

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors({origin: '*'}))
app.use('/auth', AuthRouter)
app.use('/country', CountryRouter)
app.use('/seed', SeedRouter)
app.set('view engine', 'ejs')

pool.getConnection((err, conn)=>{
    if(!err){
        console.log('FWR-Server is now connected to MySQL Database')
    }else{
        console.log('Connection Error', err)
    }
})
app.get('/', (req, res) => res.render('index'))

app.listen(process.env.PORT, () => console.log(`FWR-Server is now listening on port ${process.env.PORT}`))