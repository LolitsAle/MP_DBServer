const mongoose = require('mongoose')

const {childCateSchema} = require('./childcategory')

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    child: [childCateSchema]
},{
    timestamps: true
})

const Category = mongoose.model('Category', CategorySchema)

module.exports = Category