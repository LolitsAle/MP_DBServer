const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const OrderSchema = new mongoose.Schema({
    online: {
        type: Boolean
    },
    // các dạng status: 'Waiting for Phone Comfirm, Prepraring your order, Delivering..., Completed'
    status: {
        type: String,
        default: 'Waiting for Phone Comfirm'
    },
    finalprice: {
        type: Number
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    items: [{
        name: {
            type: String,
            default: 'Unknown'
        },
        quantity: {
            type: Number,
            default: 1
        },
        price: {
            type: Number
        },
        dish: {
            type: mongoose.Schema.Types.ObjectId,

        }
    }],
    paymentmethod: {
        paymentname: {
            type: String
        },
        paymentid: {
            type: String
        },
        payer:{
            name:{
                type: String
            },
        },
        status: {
            type: String,
            default: 'Uncomplete'
        }
    }
},{
    timestamps: true
})

const Order = mongoose.model('Order', OrderSchema)

module.exports = Order