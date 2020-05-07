const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { TokenKeyString } = require('../utils/getWebdata')
const { InvalidSession } = require('../utils/getErrMessage')

const auth = async (req, res, next) => {
    try{

        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'TokenKeyString')
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

        if(!user) throw new Error('Invalid session')

        req.token = token
        req.user = user

        next()
    }catch (e) {
        res.status(401).send({ error : "please authenticate"})
    }
}

module.exports = auth