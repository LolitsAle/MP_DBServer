const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('./../middleware/auth')
const { inactiveEmail } = require('../utils/getErrMessage')

//đăng nhập
router.post('/users/login', async (req, res) => {
    try {
        
        console.log("api called")
        const user = await User.findByCredentials(req.body.email, req.body.password)

        if(user.isactive == "false"){
            throw new Error(inactiveEmail)
        }

        const token = await user.generateAuthToken()

        res.send({user, token})
    }catch (e){
        res.status(400).send({error : e.message})
    }
})

//đăng xuất
router.post('/users/logout',auth , async (req, res) => {
    //Kiểm tra xem đã đăng nhập chưa
    //Lấy User và xóa token
    //Lưu lại và gửi status code: 200
})

//đăng ký
router.post('/users/signup', async (req, res) => {
    //Kiểm tra xem người dùng có tồn tại hay không
    //
})

module.exports = router
