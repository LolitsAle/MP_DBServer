const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const dishSchema = new mongoose.Schema({
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
    },
    tags: [{
        tagid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tag'
        }
    }],
    kcal: {
        type: Number
    },
    mainpicture: {
        type: Buffer
    },
    gallery: [{
        //dữ liệu hình ảnh
        picname: {
            type: String,
            default: 'productpic'
        },
        binarydata: {
            type: Buffer
        }
    }]
})

const Dish = mongoose.model('Dish', dishSchema)

module.exports = Dish