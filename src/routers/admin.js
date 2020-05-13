const express = require('express')
const router = new express.Router()

const Dish = require('../models/dish')
const Category = require('../models/category')
const Ingredient = require('../models/ingredient')
const Taste = require('../models/taste')

const auth = require('./../middleware/auth') 
const requireadmin = require('../middleware/requireadmin')
const { inactiveEmail, invalidRequest } = require('../utils/getErrMessage')

//=================================Category=========================================
//lay thong tin category theo id
router.get('/category/:id', async (req, res) => {
    try{
        const category = await Category.findById(req.params.id)

        if(!Category) {
            throw new Error('Category cannot be found')
        }

        res.send(Category)
    }catch (e) {
        res.status(400).send({error : e.message})
    }
    
})
//them category moi
router.post('/category', auth, requireadmin, async (req, res) => {
    const category = new Category(req.body)

    try{
        await category.save()
        
        res.send({Status: 'OK'})
    }catch (e) {
        res.status(400).send({error : e.message})
    }
})
//cập nhật 1 category
router.patch('/category/:id', auth, requireadmin, async (req, res) => {
    const request = Object.keys(req.body)
    const validRequest = ["name","description"] //mảng chứa các phẩn tử cho phép
    const isRequestValid = request.every((item) => {
        if(validRequest.includes(item)) return true
    })

    if(!isRequestValid) {
        return res.status(400).send(invalidRequest)
    }

    try{
        const category = Category.findById(req.params.id)

        if(!category) {
            throw new Error('Category cannot be found')
        }

        request.forEach((item) => category[item] = req.body[item])
        await category.save()
        
        res.send({Status: 'Updated'})
    }catch (e) {
        res.status(400).send({error : e.message})
    }
})
//xóa 1 Category
router.delete('/category/:id', auth, requireadmin, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)

        if(!category) {
            throw new Error('Category cannot be found')
        }

        await category.remove()

        res.send({Status : 'Removed'})
    }catch (e) {
        res.status(400).send()
    }
})

//=================================Taste=========================================
//lay thong tin taste theo id
router.get('/taste/:id', async (req, res) => {
    try{
        const taste = await Taste.findById(req.params.id)

        if(!taste) {
            throw new Error('Taste cannot be found')
        }

        res.send(taste)
    }catch (e) {
        res.status(400).send({error : e.message})
    }
    
})
//them taste moi
router.post('/taste', auth, requireadmin, async (req, res) => {
    const taste = new Taste(req.body)

    try{
        await taste.save()
        
        res.send({Status: 'OK'})
    }catch (e) {
        res.status(400).send({error : e.message})
    }
})
//cập nhật 1 taste
router.patch('/taste/:id', auth, requireadmin, async (req, res) => {
    const request = Object.keys(req.body)
    const validRequest = ["name","description"] //mảng chứa các phẩn tử cho phép
    const isRequestValid = request.every((item) => {
        if(validRequest.includes(item)) return true
    })

    if(!isRequestValid) {
        return res.status(400).send(invalidRequest)
    }

    try{
        const taste = await Taste.findById(req.params.id)

        if(!taste) {
            throw new Error('Taste cannot be found')
        }

        request.forEach((item) => taste[item] = req.body[item])
        await taste.save()
        
        res.send({Status: 'Updated'})
    }catch (e) {
        res.status(400).send({error : e.message})
    }
})
//xóa 1 Category
router.delete('/taste/:id', auth, requireadmin, async (req, res) => {
    try {
        const taste = await Taste.findById(req.params.id)

        if(!taste) {
            throw new Error('Taste cannot be found')
        }

        await taste.remove()

        res.send({Status : 'Removed'})
    }catch (e) {
        res.status(400).send()
    }
})

//=================================Ingredient=========================================
//lay thong tin ingredient theo id
router.get('/ingredient/:id', async (req, res) => {
    try{
        const ingredient = await Ingredient.findById(req.params.id)

        if(!ingredient) {
            throw new Error('Ingredient cannot be found')
        }

        res.send(ingredient)
    }catch (e) {
        res.status(400).send({error : e.message})
    }
    
})
//them ingredient moi
router.post('/ingredient', auth, requireadmin, async (req, res) => {
    const ingredient = new Ingredient(req.body)

    try{
        await ingredient.save()
        
        res.send({Status: 'OK'})
    }catch (e) {
        res.status(400).send({error : e.message})
    }
})
//cập nhật 1 taste
router.patch('/ingredient/:id', auth, requireadmin, async (req, res) => {
    const request = Object.keys(req.body)
    const validRequest = ["name","description"] //mảng chứa các phẩn tử cho phép
    const isRequestValid = request.every((item) => {
        if(validRequest.includes(item)) return true
    })

    if(!isRequestValid) {
        return res.status(400).send(invalidRequest)
    }

    try{
        const ingredient = await Ingredient.findById(req.params.id)

        if(!ingredient) {
            throw new Error('Ingredient cannot be found')
        }

        request.forEach((item) => ingredient[item] = req.body[item])
        await ingredient.save()
        
        res.send({Status: 'Updated'})
    }catch (e) {
        res.status(400).send({error : e.message})
    }
})
//xóa 1 ingredient
router.delete('/ingredient/:id', auth, requireadmin, async (req, res) => {
    try {
        const ingredient = await Ingredient.findById(req.params.id)

        if(!ingredient) {
            throw new Error('Ingredient cannot be found')
        }

        await ingredient.remove()

        res.send({Status : 'Removed'})
    }catch (e) {
        res.status(400).send()
    }
})

module.exports = router