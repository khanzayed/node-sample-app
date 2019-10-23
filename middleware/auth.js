const jwt = require('jsonwebtoken')
const User = require('../database/models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decodedToken = jwt.verify(token, 'mysampleapplication')
        const user = await User.getUserByEmail(decodedToken._id)

        if (!user) {
            throw new Error('Could not find user!')
        }

        req.user = user
        
        next()
    } catch (e) {
        res.status(400).send(e.toString())
    }
    
}

module.exports = auth