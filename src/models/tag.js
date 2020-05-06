const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const tagSchema = new mongoose.Schema({
})

const Tag = mongoose.model('Tag', tagSchema)

module.exports = Tag