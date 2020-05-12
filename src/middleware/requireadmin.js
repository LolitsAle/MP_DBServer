
//middleware kiểm tra role người dùng có phải admin hay không
const { lackPermission } = require('../utils/getErrMessage')

const requireadmin = async (req, res, next) => {
    try{
        if(req.user.role === "admin") {
            next()
        } else{
            throw new Error()
        }
    }catch (e) {
        res.status(401).send({ error : lackPermission})
    }
}

module.exports = requireadmin