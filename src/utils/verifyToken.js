const jwt = require('jsonwebtoken')
const { TokenKeyString } = require('../utils/getWebdata')

const verifyToken = (token) => {
    try{
        const decoded = jwt.verify(token, TokenKeyString)
        return true
    }catch (e) {
        return false
    }
}

module.exports = verifyToken