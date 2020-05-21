const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            default: "Description has not been set."
        }
    }
)

//Unique validation message change
CategorySchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
      next(new Error('name must be unique'))
    } else {
      next()
    }
})

const Category = mongoose.model('Category', CategorySchema)

module.exports = Category

