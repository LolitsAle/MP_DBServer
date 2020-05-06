const express = require('express')
const router = new express.Router()
const User = require('../models/user')

//đăng nhập
router.post('/login', async (req, res) => {
    // 
    const user = new User({
        name: "songas",
        password: "a47867869698",
        email: "songas2@gmail.com"
    })
    user.save()
    user.consolelog()
    res.send(user)
})

//đăng xuất
router.post('/logout', async (req, res) => {
    //Kiểm tra xem đã đăng nhập chưa
    //Lấy User và xóa token
    //Lưu lại và gửi status code: 200
})

//đăng nhập
router.post('/signup', async (req, res) => {
    //Kiểm tra xem người dùng có tồn tại hay không
    //
})

module.exports = router
