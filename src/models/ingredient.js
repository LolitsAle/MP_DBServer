const mongoose = require('mongoose')

const Dish = require('./dish')

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

//xóa thông tin món ăn có nguyên liệu bị xóa
IngredientSchema.pre('remove', async function(next) {
    const remingredient = this

    const dish = await Dish.find({'ingredients.ingredient': remingredient._id})

    await dish.forEach(async element => {
        element.ingredients = element.ingredients.filter(function(element) {
            return element.ingredient.toString() != remingredient._id.toString()
        })
        await element.save()
    })

    next()
})

const Ingredient = mongoose.model('Ingredient', IngredientSchema)

module.exports = Ingredient