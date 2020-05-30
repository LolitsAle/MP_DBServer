const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Dish = require('../models/dish')

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

userTableSchema.methods.calculateTotalPrice = function () {
    const table = this

    const code = new Promise((resolve, reject) => {
        var totalprice = 0
        var counter = 0

        table.dishes.forEach(async item => {
            const pdish = await Dish.findById(item.dish)
            console.log(pdish);

            totalprice += (pdish.promotionprice * item.quantity)
            counter ++

            if(counter === table.dishes.length) {
                table.totalprice = totalprice
                console.log(table)
                resolve()
            }
        })
    })

    code.then(()=> {
        console.log(table, {a : 2})
        table.save()
    })
}

userTableSchema.pre('save', function(next) {
    next()
})

const UserTable = mongoose.model('UserTable', userTableSchema)

module.exports = UserTable