const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { UsedProductName, ProductNameEmpty, NegativePrice, InvalidPromotionPrice, Negativekcal } = require('../utils/getErrMessage')
const { defaultDishDescription } = require('../utils/getWebdata')

const dishSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, ProductNameEmpty],
        unique: [true, UsedProductName],
        trim: true
    },
    desciption: {
        type: String,
        default: "Description for this forduct has not been set..."
    },
    price: {
        type: Number,
        validate(value) {
            if(value <= 0) {
                throw new Error(NegativePrice)
            }
        } 
    },
    promotionprice: {
        type: Number,
        validate(value) {
            if(value >= price) {
                throw new Error(InvalidPromotionPrice)
            }
        } 
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    tastes: [{
        tasteid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tag'
        }
    }],
    ingredients: [{
        ingredientid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ingredient'
        }
    }],
    kcal: {
        type: Number,
        default: 0,
        validate(value) {
            if(value <= 0) {
                throw new Error(Negativekcal)
            }
        } 
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
    }],
    rating: {
        type: Number,
        default: 0
    }
})

const Dish = mongoose.model('Dish', dishSchema)

module.exports = Dish