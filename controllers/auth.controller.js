const pool = require("../connections/pool")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { sendVerificationCode } = require('../verify')

const register = async (req, res) => {
    let payload = req.body;
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    //Check if mail has previously been registered
    const checkEmailQuery = `SELECT COUNT(*) AS count FROM users WHERE email = ?`
    pool.query(checkEmailQuery, [payload.email], async (err, result) => {
        const emailExists = result[0].count > 0;
        if (emailExists) {
            return res.status(409).json({ message: 'This mail has previously been registered' });
        }
    })
    const values = [payload.email, hashedPassword, payload.phonenum]
    const sql = `INSERT INTO users (email, password, phonenum) VALUES(?, ?, ?)`
    pool.query(sql, values, (err, result) => {
        if (!err) {
            res.status(200).json({message: 'Success'})
        } else {
            console.log(err)
            res.status(500).json({message: 'Internal Server Error'})
        }
    })
}


const login = (req, res) => {
    let payload = req.body
    const values = [payload.email]
    const checkEmail = `SELECT * FROM users WHERE email = ?`
    pool.query(checkEmail, values, async (err, result)=>{
        const user = result
        if (err) {
            return res.status(500).json({message: 'Internal Server Error'})
        }
        if (user.length == 0) {
            return res.status(200).json({status: false, message: 'User not found'})
        }
        if (await bcrypt.compare(payload.password, user[0].password)) {
            if (user.is_phone_verified) {
                const token = accessToken(user)
                res.status(200).json({status: true, token})
            } else {
                sendVerificationCode(res, user);
            }
        } else {
            return res.status(200).json({status: false, message: 'Incorrect Password'})
        }
    })
}


const accessToken = (user)=>{
    return jwt.sign({ result: user }, process.env.JWT_SECRET, { expiresIn: '60m' })    
}
const currentUser = (req, res)=>{
    res.status(200).json({loggedInUser: req.user[0]})
}



module.exports = { register, login, currentUser }