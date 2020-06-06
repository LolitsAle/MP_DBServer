const express = require('express')
const router = new express.Router()
const multer = require('multer')
const sharp = require('sharp')

const User = require('../models/user')
const userTable = require('../models/usertable')
const Dish = require('../models/dish')
const auth = require('./../middleware/auth')
const requireadmin = require('../middleware/requireadmin')

const generateActivationCode = require('../utils/generateActivationCode')
const generateRecoverCode = require('../utils/generateRecoverCode')
const sendActivationMail = require('../utils/sendActivationMail')
const sendRecoverMail = require('../utils/sendRecoverMail')
const verifyToken = require('../utils/verifyToken')

const { inactiveEmail, invalidRequest, cannotFindEmail, cannotFindInfo, incorrectActivationCode, mailAlreadyActivated, incorrectRecoverCode, UpdateFailed, InvalidUserUpdate, ImageRequired } = require('../utils/getErrMessage')


//đăng nhập
router.post('/users/login', async (req, res) => {
    try {

        const user = await User.findByCredentials(req.body.email, req.body.password)

        if(user.isactive === false){
            throw new Error( inactiveEmail )
        }

        const token = await user.generateAuthToken()

        //lọc dữ liệu
        const data = user.toObject()
    
        res.send({Status: 'OK' ,token , role: user.role, name: user.name, avatar: data.avatar})
    }catch (e){
        res.status(401).send({error : e.message})
    }
})

//đăng xuất
router.post('/users/logout',auth , async (req, res) => {
    try{
        req.user.tokens = await req.user.tokens.filter(token => token.token != req.token)
        await req.user.save()
        res.send({status: 'Logged out...'})

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
        const code = generateActivationCode()
        user.activationcode = code
        await user.save()
    
        //gửi mail
        sendActivationMail(req.body.email, code, (error, response) => {
            if(error) {
                res.status(401).send()
            }else{
                res.send({Status: 'OK', Message: 'Activation mail has been sent'})
            }
        })
    }catch (e) {
        res.status(401).send({error : e.message})
    }
})

//upload ảnh đại diện
const avatar = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error(ImageRequired))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, avatar.single('avatar'), async (req, res) => {
    //const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()

    req.user.avatar = req.body.avatar;
    await req.user.save()

    res.send({ status: "OK", avatar: req.user.avatar.toString() });
}, (error, req, res, next) => {
    res.status(400).send({error : error.message})
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()

    res.send()
})

//lay avatar ng dung theo id
router.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar) {
            throw new Error('cannot find avatar')
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    }catch (e) {
        res.status(400).send(e.message)
    }
})

//lấy thông tin của mình
router.get('/users/me', auth, async(req, res) => {
    try{
        res.send(req.user)
    }catch (e) {
        res.status(400).send({error : e.message})
    }
})

//lấy thông tin người dùng khác
router.get('/users/:id', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)

        if(!user) {
            throw new Error(cannotFindInfo)
        }

        res.send(user)
    }catch (e) {
        res.status(400).send({error : e.message})
    }
})

//cập nhật thông tin người dùng
router.patch('/users/me', auth, async (req,res) => {

    const updates = Object.keys(req.body)
    const validUpdates = ["name","age", "gender", "address"]
    const isUpdatesValid = updates.every((item) => {
        if(validUpdates.includes(item)) return true
    })

    if(!isUpdatesValid) {
        return res.status(400).send({error : InvalidUserUpdate})
    }

    try{
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.status(200).send({status : 'OK'})
    }catch(e) {
        res.status(400).send({error : UpdateFailed})
    }

})
//sửa& xóa người dùng/ xóa luôn giỏ hàng của người dùng, yêu cầu quyền admin


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
            user.activationcode = undefined
            await user.save()

            res.send({Status : 'email activated' })
        }else{
            res.status(202).send({error : incorrectActivationCode })
        }
    }catch (e) {
        res.status(400).send({error : e.message})
    }
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
            user.passwordrecovercode = undefined
            
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

        if(!user) {
            res.status(401).send({error : cannotFindEmail})
        }

        //kiểm tra recover token còn hiệu lực hay không
        if(rtoken == user.recoveringtoken && verifyToken(rtoken) == true) {
            user.password = req.body.password
            user.recoveringtoken = undefined //xóa token
            await user.save()

            res.send({Status : 'OK'})
        }else{
            throw new Error('Failed to verify your request')
        }

    }catch (e) {
        res.status(400).send({error: e.message})
    }
})


//tạo usertable mới
router.post('/users/createnewtable', auth, async (req, res) => {
    try{
        const table = new userTable({
            name: req.body.name,
            userid: req.user._id,
            dishes: []
        })
    
        await table.save()
    
        res.send({status: 'OK'})
    }catch(e) {
        res.status(400).send({error : e.message})
    }
})

//route truy cập giỏ hàng của người dùng
router.get('/users/table/me', auth, async (req, res) => {
    try{
        await req.user.populate({
            path: 'tables',
            populate: {
                path : 'dishes.dish'
            }
        }).execPopulate()

        res.send(req.user.tables)

    }catch(e) {
        res.status(400).send({error : e.message})
    }
})


//thêm sản phẩm vào bàn ăn
//reqdata : {dish : id, table: id }
router.post('/users/table/me/adddish', auth, async (req, res) => {
    try{
        //kiểm tra dữ liệu đầu vào
        const dish = await Dish.findById(req.body.dish)
        if(!dish) {
            throw new Error('Dish cannot be found!')
        }

        const table = await userTable.findOne({
            userid : req.user._id, 
           // _id : req.body.table
        })

        if(!table) {
            throw new Error('Table cannot be found!')
        }

        //kiểm tra xem trong table có sản phẩm đó hay chưa? => nếu có r thì + thêm 1
        var status = false
        await table.dishes.forEach(item => {
            if(item.dish == req.body.dish) {
                item.quantity += 1
                status = true
            }
        })
        if(status == false){
            //tiến hành thêm dữ liệu
            table.dishes = table.dishes.concat({dish : req.body.dish })
        }

        await table.calculateTotalPrice()

        res.send({status: 'Saved'})
    }catch (e) {
        res.status(400).send({error : e.message})
    }
})

//api sửa bàn ăn cửa người dùng
//thêm 1 quantity vào giỏ hàng params: id: id, task: increase/decrease
router.patch('/users/me/updatetable/:tableid', auth, async (req, res) => {
    try {
        const table = await userTable.findOne({
            userid : req.user._id, 
           // _id : req.body.table
        })
        
        if(!table) {
            throw new Error('Could not find table')
        }
        
        var checker = false;
        switch (req.query.task){
            case 'increase' :{
                //tìm thuộc tính có id cung cấp
                table.dishes.forEach(item => {
                    if(item._id == req.query.id){
                        item.quantity ++
                        checker = true
                    }
                })
                break
            }
            case 'decrease' :{
                //tìm thuộc tính có id cung cấp
                table.dishes.forEach(item => {
                    if(item._id == req.query.id){
                        item.quantity --
                        checker = true
                    }
                })
                break
            }
            case 'remove': {
                //filter lại mảng trong table
                table.dishes = await table.dishes.filter(item => item._id != req.query.id)
                checker = true
                break
            }
            //task sais
            default: {
                throw new Error('invalid request!')
            }
        }

        if(checker == false) {
            throw new Error('Cannot find dish')
        }

        await table.calculateTotalPrice()

        res.send()
    } catch (error) {
        res.status(400).send({error: error.message})
    }
    
})
//cấp quyền admin bằng secretkey
module.exports = router
