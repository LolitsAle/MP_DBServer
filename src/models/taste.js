const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const TasteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: 'Description has not been set.'
    }
},{
    timestamps: true
})

//xóa thông tin món ăn có vị bị xóa
TasteSchema.pre('remove', async function(next) {
    const remtaste = this

    const dish = await Dish.find({'tastes.taste': remtaste._id})

    await dish.forEach(async element => {
        element.tastes = element.tastes.filter(function(element) {
            return element.taste.toString() != remtaste._id.toString()
        })
        await element.save()
    })

    next()
})

const Taste = mongoose.model('Taste', TasteSchema)

module.exports = Taste