const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userTableSchema = new mongoose.Schema({
    userid : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    products : [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product'
        }
    }]
})

const UserTable = mongoose.model('Tag', userTableSchema)

module.exports = UserTable