const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userTableSchema = new mongoose.Schema({
})

const UserTable = mongoose.model('Tag', userTableSchema)

module.exports = UserTable