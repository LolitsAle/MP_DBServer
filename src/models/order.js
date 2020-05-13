const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const OrderSchema = new mongoose.Schema({
})

const Order = mongoose.model('Order', OrderSchema)

module.exports = Order