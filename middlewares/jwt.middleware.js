const jwt = require('jsonwebtoken')

const authJWT = (req, res, next)=>{
    const splitJWT = req.headers.authorization
    if (splitJWT) {
        const token = splitJWT.split(' ')[1]
        jwt.verify(token, process.env.JWT_SECRET, (err, data)=>{
            if (err) {
                res.status(500).json({message: 'Token Expired'})
            } else {            
                req.user = data.result
                next()
            }
        })
    } else {
        res.status(500).json({message: 'Invalid Token'})
    }
}

module.exports = { authJWT }