const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const IngredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: "Description has not been set."
    },
    source: {
        type: String,
        default: ""
    }
},{
    timestamps: true
})

const Ingredient = mongoose.model('Ingredient', IngredientSchema)

module.exports = Ingredient