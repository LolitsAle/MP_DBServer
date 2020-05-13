const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: "Description has not been set."
    }
},{
    timestamps: true
})

const Category = mongoose.model('Category', CategorySchema)

module.exports = Category