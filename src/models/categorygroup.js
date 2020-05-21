const mongoose = require('mongoose')
const Category = require('./category')

const CategoryGroupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        categories: [{
            category:{
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Category'
            }
        }]
    },{
        timestamps: true
    })

//lọc dữ liệu trước khi trả về
CategoryGroupSchema.methods.toJSON = function () {
        const categroup = this
        const categroupObject = categroup.toObject()

        return categroupObject
    }
//xóa các category con bên collection Category
CategoryGroupSchema.pre('remove', async function(next) {
    const categorygroup = this

    categorygroup.categories.forEach(async element => {
        const categories = await Category.findById(element.category)
        await categories.remove()
    });

    next()
})
const CategoryGroup = mongoose.model('CategoryGroup', CategoryGroupSchema)

module.exports = CategoryGroup