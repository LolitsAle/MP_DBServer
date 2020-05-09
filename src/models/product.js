const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "product name cannot be empty"],
        unique: [true, "this product name already used"],
        trim: true
    },
    desciption: {
        type: String,
        default: "Description for this forduct has not been set..."
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product