
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


module.exports = { isAdmin, isAuth }