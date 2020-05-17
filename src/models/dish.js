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
    description: {
        type: String,
        default: "Description for this dish has not been set..."
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
        type: Number
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    tastes: [{
        taste: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Taste'
        }
    }],
    ingredients: [{
        ingredient: {
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
},{
    timestamps: true
})

//Lọc dữ liệu trước khi trả client
dishSchema.methods.toJSON = function () {
    const dish = this
    const dishObject = dish.toObject()

    dishObject.ingredients.forEach(element => {
        delete element._id
    });

    dishObject.tastes.forEach(element => {
        delete element._id
    });

    return dishObject
}

//Unique validation message change
dishSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
      next(new Error('Dish already exist, use another name'));
    } else {
      next();
    }
});

dishSchema.pre('save', function(next) {
    const dish = this

    if(dish.promotionprice >= dish.price){
        throw new Error('Promotion price must be lower than price')
    }
    
    next()
})



const Dish = mongoose.model('Dish', dishSchema)

module.exports = Dish