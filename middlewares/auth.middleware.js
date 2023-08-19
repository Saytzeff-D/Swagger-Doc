const jwt = require('jsonwebtoken')

const isAuth = (req, res, next) => {
    if(!req.user) {
        return res.status(403).json({message: 'You need to log in'})
    }
    next()
}

const isAdmin = (req, res, next) => {
    if(!req.user || !req.user.isAdmin) {
        return res.status(403).json({message: 'Forbidden'})
    }
    next()
}

const isVerified = (req, res, next) => {
    if(!req.user || !req.user.isVerified) {
        return res.status(403).json({message: 'You need to log in again and verify your account'})
    }
    next()
}

const authJWT = (req, res, next)=>{
    const splitJWT = req.headers.authorization
    if (splitJWT) {
        const token = splitJWT.split(' ')[1]
        jwt.verify(token, process.env.JWT_SECRET, (err, data)=>{
            if (err) {
                console.log(err)
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


module.exports = { isAdmin, isAuth, isVerified, authJWT }