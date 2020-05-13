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

const Taste = mongoose.model('Taste', TasteSchema)

module.exports = Taste