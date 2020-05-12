const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const TasteSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'Unknown Tag'
    },
    description: {
        type: String,
        default: ''
    }
})

const Taste = mongoose.model('Taste', TasteSchema)

module.exports = Tag