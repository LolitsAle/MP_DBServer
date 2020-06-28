const express = require('express')
const router = new express.Router()

const auth = require('./../middleware/auth') 
const requireadmin = require('../middleware/requireadmin')
const { inactiveEmail, invalidRequest } = require('../utils/getErrMessage')

const Category = require('../models/category')
const CategoryGroup = require('../models/categorygroup')

//=================================Category Group=========================================
//lay toàn bo danh sach category
router.get('/category/:id', async (req, res) => {
    const categorygroup = await CategoryGroup.findById(req.params.id)

    await categorygroup.populate('categories.category').execPopulate()

    res.send(categorygroup)
})
router.get('/category', async (req, res) => {
    try{
        const categoryGroups = await CategoryGroup.find({}).populate('categories.category').exec()

        res.send(categoryGroups)
    }catch (e) {
        res.status(400).send({error : e.message})
    }
})
//tạo category mới
//reqdata: {name, description, groupname}
//hàm tạo nhóm danh mục mới
router.post('/category', auth, requireadmin, async (req, res) => {
    try{
        const category = new Category(req.body)
        await category.save()

        //kiểm tra nhóm danh mục
        if(!req.body.groupname) {
            throw new Error('groupname is required')
        }
        const group = await CategoryGroup.findOne({name: req.body.groupname})

        //thực hiện khi group chưa có
        if(!group || group == []) {
            const newgroup = new CategoryGroup()
            newgroup.name = req.body.groupname
            newgroup.categories = []
            newgroup.categories = newgroup.categories.concat({category: category._id})
            
            await newgroup.save()

            res.send({status: 'Created new Group, Added new Categories'})
        }else{
            group.categories.push({category: category._id}) 
            await group.save()

            res.send({status: 'Added new Categories'})
        }
    }catch (e) {
        res.status(400).send({error : e.message})
    }
})

//sửa tên (cập nhật) cho 1 nhóm danh mục
router.patch('/category/group/:id',auth, requireadmin, async (req, res) => {
    const request = Object.keys(req.body)
    const validRequest = ["name"] //mảng chứa các phẩn tử cho phép
    const isRequestValid = request.every((item) => {
        if(validRequest.includes(item)) return true
    })

    if(!isRequestValid) {
        return res.status(400).send(invalidRequest)
    }

    try{
        const categorygroup = await CategoryGroup.findById(req.params.id)
        if(!categorygroup) {
            throw new Error('Cannot find group')
        }
        request.forEach((item) => categorygroup[item] = req.body[item])
        await categorygroup.save()

        res.send({status: 'Updated'})
    }catch (e) {
        res.status(400).send({error : e.message})
    }
})
router.patch('/category/:id',auth, requireadmin, async (req, res) => {
    const request = Object.keys(req.body)
    const validRequest = ["name","description"] //mảng chứa các phẩn tử cho phép
    const isRequestValid = request.every((item) => {
        if(validRequest.includes(item)) return true
    })

    if(!isRequestValid) {
        return res.status(400).send(invalidRequest)
    }

    try{
        const category = await Category.findById(req.params.id)
        if(!category) {
            throw new Error('Cannot find category')
        }
        request.forEach((item) => category[item] = category[item])
        await category.save()

        res.send({status: 'Updated'})
    }catch (e) {
        res.status(400).send({error : e.message})
    }
})
//xóa danh mục và nhóm danh mục
router.delete('/category/:id',auth, requireadmin, async (req, res) => {
    try{
        const category = await Category.findById(req.params.id)

        if(!category) {
            throw new Error('Cannot find category')
        }

        await category.remove()
        res.send({status: 'Removed'})

    }catch (e) {
        res.status(400).send({error: e.message})
    }
})

router.delete('/category/group/:id',auth, requireadmin, async (req, res) => {
    try{
        const categorygroup = await CategoryGroup.findById(req.params.id)

        if(!categorygroup) {
            throw new Error('Cannot find category')
        }

        await categorygroup.remove()
        res.send({status: 'Removed'})
    }catch (e) {
        res.status(400).send({error: e.message})
    }
})

module.exports = router