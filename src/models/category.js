const mongoose = require('mongoose')

const Dish = require('./dish')

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

//Lọc dữ liệu trước khi trả client
CategorySchema.methods.toJSON = function () {
    const category = this
    const categoryObject = category.toObject()

    //delete items here
    
    return categoryObject
}

//xóa thông tin danh mục các sản phẩm có danh mục này
CategorySchema.pre('remove', async function(next) {
    const category = this

    const dish = await Dish.find({category : category._id})

    await dish.forEach(async element => {
        element.category = undefined
        await element.save()
    })

    next()
})

const Category = mongoose.model('Category', CategorySchema)

module.exports = Category

