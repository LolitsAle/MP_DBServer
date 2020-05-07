const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { TokenKeyString } = require('../utils/getWebdata')
const { invalidSession, unAuthenticate } = require('../utils/getErrMessage')

const auth = async (req, res, next) => {
    try{

        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, TokenKeyString)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

        if(!user) throw new Error(invalidSession)

        req.token = token
        req.user = user

        next()
    }catch (e) {
        res.status(401).send({ error : unAuthenticate})
    }
}

module.exports = auth