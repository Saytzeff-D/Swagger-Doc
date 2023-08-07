const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors');
const bodyParser = require("body-parser");
const pool = require('./connections/pool');
const AuthRouter = require('./routes/auth.route');
const SeedRouter = require('./routes/seedRoute');
const CountryRouter = require('./routes/countryRoute');
const DocumentRouter = require('./routes/documentsRoute');

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors({origin: '*'}))
app.use('/auth', AuthRouter)
app.use('/country', CountryRouter)
app.use('/seed', SeedRouter)
app.use('/documents', DocumentRouter)

pool.getConnection((err, conn)=>{
    if(!err){
        console.log('FWR-Server is now connected to MySQL Database')
    }else{
        console.log('Connection Error', err)
    }
})
app.get('/', (req, res) => res.send('Server is now live'))

app.listen(process.env.PORT, () => console.log(`FWR-Server is now listening on port ${process.env.PORT}`))