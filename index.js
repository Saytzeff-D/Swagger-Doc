const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors');
const bodyParser = require("body-parser");
const pool = require('./connections/pool');
const swaggerUI = require('swagger-ui-express')
const swaggerDocs = require('swagger-jsdoc')
const AuthRouter = require('./routes/auth.route');
const AdminRouter = require('./routes/admin.route');
const SeedRouter = require('./routes/seed.route');
const ChapterRouter = require('./routes/chapter.route');
const DocumentRouter = require('./routes/documents.route');
const VerifyRouter = require('./routes/verify.route');

const options = {
    explorer: true,
    definition: {
        openapi: "3.0.0",
        info: {
            title: 'ForeignWR API DOCS',
            version: '0.0.1',
            description: 'Rest API Swagger Documentation for Foreign Wives Reign'
        }
    },
    servers: [
        {
            url: 'https://foreignwr-server.onrender.com/'            
        }
    ],
    apis: [
        './controllers/*.js'        
    ],
    failOnErrors: true
}

const specs = swaggerDocs(options)
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors({origin: '*'}))
app.use('/api', swaggerUI.serve, swaggerUI.setup(specs))
app.use('/auth', AuthRouter)
app.use('/admin', AdminRouter)
app.use('/chapter', ChapterRouter)
app.use('/seed', SeedRouter)
app.use('/documents', DocumentRouter)
app.use('/verify', VerifyRouter)
app.set('view engine', 'ejs')

pool.getConnection((err, conn)=>{
    if(!err){
        console.log('FWR-Server is now connected to MySQL Database')
    }else{
        console.log('Connection Error')
    }
})
app.get('/', (req, res) => res.render('index'))

app.listen(process.env.PORT, () => console.log(`FWR-Server is now listening on port ${process.env.PORT}`))