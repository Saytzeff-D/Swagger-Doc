const pool = require("../connections/pool")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { createNotification } = require('../utils')
const { sendVerificationCode } = require("./sms.controller")

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstname
 *         - lastname
 *         - username
 *         - phonenum
 *         - email
 *         - password
 *         - image
 *         - about
 *         - document
 *         - joined_date
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         username:
 *           type: string
 *         phonenum:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         image:
 *           type: string
 *         about:
 *           type: string         
 *         documents:
 *           type: text       
 *         joined_date:
 *           type: timestamp
 */

/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: The user authentication API
*/

/**
 * @swagger
 * /auth/register:
 *  post:
 *    summary: registers a new user
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            required: 
 *              - email
 *              - password
 *              - phonenum
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *            example: 
 *              email: example@gmail.com
 *              password: "example1234!"
 *              phonenum: "+2348164572165"
 *    responses:
 *      200:
 *        description: registration successful 
 *      500:
 *        description: Internal Server Error 
 *    
 */
const register = async (req, res) => {
    let payload = req.body;
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    //Check if mail has previously been registered
    const checkEmailQuery = `SELECT COUNT(*) AS count FROM users WHERE email = ?`
    pool.query(checkEmailQuery, [payload.email], async (err, result) => {
        if (result && result.length > 0) {
            const emailExists = result[0].count > 0;
            if (emailExists) {            
                return res.status(200).json({ status: false, message: 'This mail has previously been registered' });
            }else {
                const values = [payload.email, hashedPassword, payload.phonenum]
                const sql = `INSERT INTO users (email, password, phonenum) VALUES(?, ?, ?)`
                pool.query(sql, values, (err, result) => {
                    if (!err) {
                        const getUserSql = `SELECT * FROM users WHERE email = ?`;
                        pool.query(getUserSql, [payload.email], async (err, result) => {
                            if (!err) createNotification("signup", result[0].id, result[0]);
                        });
                        // sendVerificationCode(res, payload)
                        res.status(200).json({status: true, message: 'Success', token: accessToken({id:result.insertId})})
                    } else {
                        console.log(err)
                        res.status(500).json({message: 'Internal Server Error'})
                    }
                })
            }
        }
    })    
}

/**
 * @swagger
 * /auth/login:
 *  post:
 *    summary: login a user
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            required: 
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *            example: 
 *              email: example@gmail.com
 *              password: "example1234!"
 *    responses:
 *      200:
 *        description: The user has succesfully logged in
 *      404:
 *        description: User not found
 *      500:
 *        description: Internal Server Error 
 *    
 */
const login = (req, res) => {
    let payload = req.body
    const values = [payload.email]
    const checkEmail = `SELECT * FROM users WHERE email = ?`
    pool.query(checkEmail, values, async (err, result)=>{
        const user = result
        if (err) {
            return res.status(500).json({message: 'Internal Server Error'})
        }else {
            if (user.length == 0) {
                return res.status(200).json({status: false, message: 'User not found'})
            }else {
                if (await bcrypt.compare(payload.password, user[0].password)) {
                    // if (user.is_phone_verified == 1) {
                        const token = accessToken(user[0])
                        res.status(200).json({status: true, token, verify: true})
                    // } else {                        
                    //     sendVerificationCode(res, user[0]);
                    // }
                } else {
                    return res.status(200).json({status: false, message: 'Incorrect Password'})
                }
            }
        }        
    })
}

const accessToken = (user)=>{
    return jwt.sign({ result: user }, process.env.JWT_SECRET, { expiresIn: '60m' })    
}

/**
 * @swagger
 * /auth/currentUser:
 *  get:
 *    summary: current logged in user
 *    tags: [Auth]
 *    parameters: 
 *     - name: authorization
 *       in: header
 *       description: an authorization header
 *       required: true
 *       type: string 
 *    responses:
 *      200:
 *        description: Return the details of the current user
 *      500:
 *        description: Internal Server Error 
 *    
 */
const currentUser = (req, res)=>{
    res.status(200).json({loggedInUser: req.user[0]})
}

module.exports = { register, login, currentUser, accessToken }