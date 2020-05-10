const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const userTable = require('../models/usertable')
const auth = require('./../middleware/auth')

const generateActivationCode = require('../utils/generateActivationCode')
const generateRecoverCode = require('../utils/generateRecoverCode')
const sendActivationMail = require('../utils/sendActivationMail')
const sendRecoverMail = require('../utils/sendRecoverMail')
const verifyToken = require('../utils/verifyToken')

const { inactiveEmail, invalidRequest, cannotFindEmail, incorrectActivationCode, mailAlreadyActivated, incorrectRecoverCode } = require('../utils/getErrMessage')


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
        
        res.send({Status: 'OK'})
    }catch (e) {
        res.status(401).send({error : e.message})
    }
})

//tạo usertable mới
router.post('/users/createnewtable', auth, async (req, res) => {
    try{
        const table = new userTable({
            name: req.body.name,
            userid: req.user._id
        })
    
        await table.save()
    
        res.send({status: 'OK'})
    }catch(e) {
        res.status(400).send({error : e.message})
    }
})

//gửi mail kích hoạt 
//request -> { email : useremail }
router.post('/users/sendactivatemail', async (req, res) => {
    try{
        //tạo một active code cho user và lưu vào database
        const code = generateActivationCode()
        const user = await User.findOne({email : req.body.email})

        if(!user) {
            res.status(401).send({error : cannotFindEmail})
        }

        if(user.isactive == true) {
            res.status(202).send({error : mailAlreadyActivated})
        }

        user.activationcode = code
        await user.save()
    
        //gửi mail
        sendActivationMail(req.body.email, code, (error, response) => {
            if(error) {
                res.status(401).send()
            }else{
                res.send(response)
            }
        })
    }catch (e) {
        res.status(401).send()
    }
})

//yêu cầu kích hoạt mail
//request {email : useremail, code : code}
router.post('/users/mailactivate', async (req, res) => {
    try{
        const user = await User.findOne({email : req.body.email})

        if(!user) {
           res.status(401).send({error : cannotFindEmail})
        }

        if(user.isactive == true) {
            res.status(202).send({error : mailAlreadyActivated})
        }

        //kiểm tra mã kích hoạt
        if(req.body.code === user.activationcode ) {

            user.isactive = true
            await user.save()

            res.send({Status : 'email activated' })
        }else{
            res.status(202).send({error : incorrectActivationCode })
        }
    }catch (e) {
        res.status(400).send({error : e.message})
    }
})

//route truy cập giỏ hàng của người dùng
router.get('/users/table/me', auth, async (req, res) => {
    try{
        await req.user.populate('tables').execPopulate()

        //remove products
        res.send(req.user.tables)

    }catch(e) {
        res.status(400).send({error : e.message})
    }
})

//route upload hình ảnh đại diện cho người dùng
router.post('/users/avatar/upload', auth, async (req, res) => {

})

//route gửi mail phục hồi/đổi mật khẩu
router.post('/users/password/sendrecovermail', async(req, res) => {
    try{
        //tạo một recover code cho user và lưu vào database
        const code = generateRecoverCode()
        const user = await User.findOne({email : req.body.email})

        if(!user) {
            res.status(401).send({error : cannotFindEmail})
        }

        user.passwordrecovercode = code
        await user.save()
    
        //gửi mail
        sendRecoverMail(req.body.email, code, (error, response) => {
            if(error) {
                res.status(401).send()
            }else{
                res.send(response)
            }
        })
    }catch (e) {
        res.status(401).send()
    }
})

//route kiểm tra mã phục hồi/đổi mật khẩu
router.get('/users/password/getrecovertoken', async (req, res) => {
    try{
        const user = await User.findOne({email : req.query.email})


        if(!user) {
           res.status(401).send({error : cannotFindEmail})
        }

        //kiểm tra mã phục hồi
        if(req.query.code == user.passwordrecovercode ) {
            const recovertoken = await user.generateRecoverToken()
           
            res.send({Status : 'OK', recovertoken })
        }else{
            res.status(202).send({error : incorrectRecoverCode })
        }
    }catch (e) {
        res.status(400).send({error : e.message})
    }
})

//route phục hồi/đổi mật khẩu
//request body {email, recovertoken, newpassword}
router.post('/users/password/changepassword', async (req, res) => {
    try{
        
        const user = await User.findOne({email : req.body.email})
        const rtoken = req.body.recovertoken

        //kiểm tra recover token còn hiệu lực hay không
        if(rtoken == user.recoveringtoken && verifyToken(rtoken) == true) {
            user.password = req.body.password
            await user.save()

            res.send({Status : 'OK'})
        }else{
            throw new Error('Failed to verify your request')
        }

    }catch (e) {
        res.status(400).send({error: e.message})
    }
})
module.exports = router
