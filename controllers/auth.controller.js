const pool = require("../connections/pool")
const jwt = require('jsonwebtoken')

const register = (req, res)=>{
    let payload = req.body
    const sql = `INSERT INTO users (email, password) VALUES('${payload.email}', '${payload.password}')`
    pool.query(sql, (err, result)=>{
        if (!err) {
            res.status(200).json({message: 'Success'})
        } else {
            res.status(300).json({message: 'Internal Server Error'})
        }
    })
}
const login = (req, res)=>{
    let payload = req.body
    const checkEmail = `SELECT * FROM users WHERE email = '${payload.email}'`
    pool.query(checkEmail, (err, result)=>{
        const user = result
        if (err) {
            res.status(300).json({message: 'Internal Server Error'})
        } else {
            if (user.length == 0) {
                res.status(200).json({message: 'User not found'})
            } else {
                user[0].password == payload.password ? accessToken(user) : res.status(200).json({message: 'Incorrect Password'})
            }
        }
    })
}
const accessToken = (user)=>{
    const token = jwt.sign({ result: user }, process.env.JWT_SECRET, { expiresIn: '60m' })
    res.status(200).json({token})
}

module.exports = { register, login }