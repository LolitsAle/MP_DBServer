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
    totalprice: {
        type: Number,
        default: 0
    },
    dishes : [{
        dish: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Dish'
        },
        quantity: {
            type: Number,
            default: 1
        }
    }]
})

//lọc dữ liệu trước khi gửi về
userTableSchema.methods.toJSON = function () {
    const userTable = this
    const userTableObject = userTable.toObject()

    // delete userTableObject.dishes
    userTableObject.dishes.forEach(element => {
        delete element._id
    });

    return userTableObject
}

const UserTable = mongoose.model('UserTable', userTableSchema)

module.exports = UserTable