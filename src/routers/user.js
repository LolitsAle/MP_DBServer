const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('./../middleware/auth')
const { inactiveEmail, invalidRequest } = require('../utils/getErrMessage')

//đăng nhập
router.post('/users/login', async (req, res) => {
    try {

        const user = await User.findByCredentials(req.body.email, req.body.password)

        if(user.isactive === false){
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
    try{
        req.user.tokens = await req.user.tokens.filter(token => token.token != req.token)
        await req.user.save()
        res.send({status: 'OK'})

    }catch (e){
        res.status(400).send(e.message)
    }
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

//gửi mail kích hoạt
router.post('/users/sendactivatemail', async (req, res) => {
    
})

//route truy cập giỏ hàng của người dùng
router.post('/users/table/me', auth, async (req, res) => {

})
module.exports = router
