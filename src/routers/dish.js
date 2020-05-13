const express = require('express')
const router = new express.Router()

const Dish = require('../models/dish')

const auth = require('../middleware/auth') 
const requireadmin = require('../middleware/requireadmin')

const { inactiveEmail, invalidRequest } = require('../utils/getErrMessage')

//lấy thông tin món ăn bằng id
//theo category/ingredients/taste/price/skip/take
router.get('/dishes/:id', async (req, res) => {
    try{
        const dish = Dish.findById(req.params.id)

        if(!dish) {
            throw new Error('Dish cannot be found')
        }

        res.send(dish)
    }catch (e) {
        res.status(400).send({error : e.message})
    }
    
})

//tra cứu món ăn

//tạo món ăn mới
router.post('/dishes', auth, requireadmin, async (req, res) => {

    const request = Object.keys(req.body)
    const validRequest = ["name","description","price","promotionprice", "kcal"] //mảng chứa các phẩn tử cho phép
    const isRequestValid = request.every((item) => {
        if(validRequest.includes(item)) return true
    })

    if(!isRequestValid) {
        return res.status(400).send(invalidRequest)
    }

    const dish = new Dish(req.body)

    try{
        await dish.save()
        
        res.send({Status: 'OK'})
    }catch (e) {
        res.status(400).send({error : e.message})
    }
})

//cập nhật món ăn
router.patch('/dishes/:id', auth, requireadmin, async (req, res) => {
    const request = Object.keys(req.body)
    const validRequest = ["name","description","price","promotionprice", "kcal"] //mảng chứa các phẩn tử cho phép
    const isRequestValid = request.every((item) => {
        if(validRequest.includes(item)) return true
    })

    if(!isRequestValid) {
        return res.status(400).send(invalidRequest)
    }

    try{
        const dish = Dish.findById(req.params.id)

        if(!dish) {
            throw new Error('Dish cannot be found')
        }

        request.forEach((item) => dish[item] = req.body[item])
        await dish.save()
        
        res.send({Status: 'OK'})
    }catch (e) {
        res.status(400).send({error : e.message})
    }
})

//xóa sản phẩm
router.delete('/dishes/:id', auth, requireadmin, async (req, res) => {
    try {
        const dish = Dish.findById(req.params.id)

        if(!dish) {
            throw new Error('Dish cannot be found')
        }

        await dish.remove()

        res.send({Status : 'Removed'})
    }catch (e) {
        res.status(400).send()
    }
})

//đánh giá/ comment sản phẩm


module.exports = router
