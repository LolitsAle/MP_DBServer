const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userTableSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "Your Table"
    },
    userid : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes : [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Dish'
        }
    }]
})

//lọc dữ liệu trước khi gửi về
userTableSchema.methods.toJSON = function () {
    const userTable = this
    const userTableObject = userTable.toObject()

    // delete userTableObject.dishes

    return userTableObject
}

const UserTable = mongoose.model('UserTable', userTableSchema)

module.exports = UserTable