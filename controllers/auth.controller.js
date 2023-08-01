const pool = require("../connections/pool")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const register = async (req, res) =>{
    let payload = req.body
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const sql = `INSERT INTO users (email, password) VALUES('${payload.email}', '${hashedPassword}')`
    pool.query(sql, (err, result)=>{
        if (!err) {
            res.status(200).json({message: 'Success'})
        } else {
            res.status(500).json({message: 'Internal Server Error'})
        }
    })
}
const login = (req, res) => {
    let payload = req.body
    const checkEmail = `SELECT * FROM users WHERE email = '${payload.email}'`
    pool.query(checkEmail, async (err, result)=>{
        const user = result
        if (err) {
            return res.status(500).json({message: 'Internal Server Error'})
        }
        if (user.length == 0) {
            return res.status(200).json({message: 'User not found'})
        }
        if (await bcrypt.compare(user[0].password, payload.password)) {
            accessToken(user)
            // res.send('Logged in!')
        } else {
            return res.status(200).json({message: 'Incorrect Password'})
        }
    })
}
const accessToken = (user)=>{
    const token = jwt.sign({ result: user }, process.env.JWT_SECRET, { expiresIn: '60m' })
    res.status(200).json({token})
}

module.exports = { register, login }