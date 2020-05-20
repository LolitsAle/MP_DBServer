const express = require('express')
const router = new express.Router()
const multer = require('multer')
const sharp = require('sharp')

const Dish = require('../models/dish')
const Category = require('../models/category')
const Ingredient = require('../models/ingredient')
const Taste = require('../models/taste')

const auth = require('../middleware/auth') 
const requireadmin = require('../middleware/requireadmin')

const { inactiveEmail, invalidRequest } = require('../utils/getErrMessage')

//lấy thông tin món ăn bằng id
router.get('/dishes/:id', async (req, res) => {
    try{
        const dish = await Dish.findById(req.params.id)

        if(!dish) {
            throw new Error('Dish cannot be found')
        }

        await dish.populate('category').execPopulate()
        await dish.populate('ingredients.ingredient').execPopulate()
        await dish.populate('tastes.taste').execPopulate()

        res.send(dish)
    }catch (e) {
        res.status(400).send({error : e.message})
    }
    
})

//tra cứu món ăn |bắt đầu bằng lấy toàn bộ món ăn|
//theo category/ingredients/taste/price/skip/take
router.get('/dishes', async(req, res) => {
    try{
        const dishes = await Dish.find({})

        if(!dishes) {
            throw new Error('Dish cannot be found')
        }
        
        res.send(dishes)
    }catch (e) {
        res.status(400).send({error : e.message})
    }
})



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
        res.status(400).send({error : e.message})
    }
})

//thêm category vào 1 sản phẩm
//reqdata: {category: categoryid}
router.patch('/dishes/:id/updatecategory', auth, requireadmin, async (req, res) => {
    try{
        const dish = await Dish.findById(req.params.id)
        if(!dish) {
            throw new Error('Dish cannot be found')
        }

        //kiểm tra category có tồn tại hay không
        const category = await Category.findById(req.body.category)
        if(!category) {
            throw new Error('Category cannot be found')
        }

        dish.category = category._id
        await dish.save()

        res.send({status: 'Updated'})

    }catch (e) {
        res.status(400).send({error : e.message})
    }
})

//thêm ingredients vào 1 sản phẩm
//reqdata: {ingredients: [ingredientID1, ingredientID2, ingredientID3]}
router.patch('/dishes/:id/updateingredients', auth, requireadmin, async (req, res) => {
    try{
        const dish = await Dish.findById(req.params.id)
        if(!dish) {
            throw new Error('Dish cannot be found')
        }

        req.body.ingredients.forEach(async element => {
            const ingredient = await Ingredient.findById(element)
            if(!ingredient) {
                throw new Error ('Cannot find ingredient')
            }
        })
        //clean the ingredients
        dish.ingredients = []
        
        req.body.ingredients.forEach(async element => {
            dish.ingredients = dish.ingredients.concat({ingredient: element})
        })

        await dish.save()

        res.send({status: 'Updated'})
    }catch (e) {
        res.status(400).send({error : e.message})
    }
})

//thêm taste vào 1 sản phẩm
//reqdata: {tastes: [tasteID1, tasteID2, tasteID3]}
router.patch('/dishes/:id/updatetastes', auth, requireadmin, async (req, res) => {
    try{
        const dish = await Dish.findById(req.params.id)
        if(!dish) {
            throw new Error('Dish cannot be found')
        }

        req.body.tastes.forEach(async element => {
            const taste = await Taste.findById(element)
            if(!taste) {
                throw new Error ('Cannot find taste')
            }
        })
        //clean the ingredients
        dish.tastes = []
        
        req.body.tastes.forEach(async element => {
            dish.tastes = dish.tastes.concat({taste: element})
        })

        await dish.save()

        res.send({status: 'Updated'})
    }catch (e) {
        res.status(400).send({error : e.message})
    }
})

//thêm ảnh chính cho món ăn
const mainpic = multer({
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

router.post('/dishes/:id/uploadmainpic', auth, requireadmin, mainpic.single('mainpic'), async (req, res)=> {
    try{
        const dish = await Dish.findById(req.params.id)

        if(!dish) {
            throw new Error('dish cannot be found')
        }

        const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()

        dish.mainpicture = buffer
        await dish.save()

        res.send()
    }catch (e) {
        res.status(400).send({error: e.message})
    }
})

//lấy ảnh của 1 sản phẩm
router.get('/dishes/:id/getmainpic', async (req, res)=>{
    const dish = await Dish.findById(req.params.id)

    if(!dish) {
        throw new Error('dish cannot be found')
    }

    res.set('Content-Type', 'image/png')
    res.send(dish.mainpicture)
})
//tạo thư viện ảnh cho món ăn 

//đánh giá/ comment sản phẩm (để sau)


module.exports = router
