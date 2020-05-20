const mongoose = require('mongoose')

const childCateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: "Description has not been set."
    }
})
const childCate = mongoose.model('ChildCate', childCateSchema)

module.exports = {childCateSchema,  childCate}