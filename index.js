const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors');
const bodyParser = require("body-parser");
const pool = require('./connections/pool');

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors({origin: '*'}))

pool.getConnection((err, conn)=>{
    if(!err){
        console.log('This server is now connected to MySQL Database')
    }else{
        console.log('Connection Error', err)
    }
})
app.get('/', (req, res) => res.send('Server is now live'))

app.listen(process.env.PORT, () => console.log(`This server is now listening on port ${process.env.PORT}`))