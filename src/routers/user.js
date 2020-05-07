const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('./../middleware/auth')
const { inactiveEmail, invalidRequest } = require('../utils/getErrMessage')

//đăng nhập
router.post('/users/login', async (req, res) => {
    try {

        const user = await User.findByCredentials(req.body.email, req.body.password)

        if(user.isactive == "false"){
            throw new Error( inactiveEmail )
        }

        const token = await user.generateAuthToken()

        res.send({Status: 'OK' ,token})
    }catch (e){
        res.status(401).send({error : e.message})
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
    //Kiểm tra body
    const request = Object.keys(req.body)
    const validRequest = ["name","password","email","age"] //mảng chứa các phẩn tử cho phép
    const isRequestValid = request.every((item) => {
        if(validRequest.includes(item)) return true
    })

    if(!isRequestValid) {
        return res.status(400).send(invalidRequest)
    }

    const user = new User(req.body)

    try{
        await user.save()
        const token = await user.generateAuthToken()
        
        res.send({Status: 'OK', token})
    }catch (e) {
        res.status(401).send({error : e.message})
    }
})

module.exports = router
