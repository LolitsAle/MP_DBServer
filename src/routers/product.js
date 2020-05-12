const express = require('express')
const router = new express.Router()
const Product = require('../models/dish')
const auth = require('./../middleware/auth') 
const { inactiveEmail, invalidRequest } = require('../utils/getErrMessage')

//tạo sản phẩm mới
//cập nhật sản phẩm


module.exports = router