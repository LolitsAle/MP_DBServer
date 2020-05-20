const User = require('../models/user')
const Category = require('../models/category')
const Dish = require('../models/dish')
const Ingredient = require('../models/ingredient')
const Taste = require('../models/taste')

const generateDemoData = async function() {
    const user1 = new User({
        "isactive" : true,
        "age" : 21,
        "role" : "admin",
        "name" : "Sơn Admin",
        "email" : "songas000@gmail.com",
        "password" : "$2a$08$7NmbwL/38GSBZ4aKCERMWuoP6xPuuiNB5P8xx2VY/QHuO.1k92Yh2",
        "tokens" : [],
        "gender" : "male",
        "address" : "2279/131/1 Huỳnh Tấn Phát Nhà bè TPHCM",
        "password" : "caiconcax"
    })
    const user2 = new User({
        "isactive" : true,
        "age" : 13,
        "role" : "user",
        "name" : "Tùng gà",
        "email" : "tunggas000@gmail.com",
        "password" : "$2a$08$J3MfRT8N9MZPxcGlmzo4cODK99Z0sJ/VoMLWd7DOV8vWEhLRYxl9G",
        "tokens" : [],
        "gender" : "male",
        "address" : "2279/131/1 Huỳnh Tấn Phát Nhà bè TPHCM",
        "password" : "caiconcax"
    })
    await user1.save()
    await user2.save()

    const ingredient1 = new Ingredient({
        "description" : "a fruit vegetable with red color, contains many Vitamins A, good for your eyes",
        "source" : "Nature Farm",
        "name" : "Tomato"
    })
    const ingredient2 = new Ingredient({
        "description" : "a root of a potato plant",
        "source" : "Nature Farm",
        "name" : "Potato"
    })
    const ingredient3 = new Ingredient({
        "description" : "quality piece of pig meat, Pig's Heaven Farm famous of having sweet pig's products",
        "source" : "Pig's Heaven Farm",
        "name" : "flesh bacon"
    })
    await ingredient1.save()
    await ingredient2.save()
    await ingredient2.save()

    const taste1 = new Taste({
        "description" : "Cay vl muốn ăn k ?",
        "name" : "spicy"
    })
    const taste2 = new Taste({
        "description" : "ăn đồ ngọt nhiều tiểu đường chết cm bây giờ.",
        "name" : "sweet",
    })
    const taste3 = new Taste({
        "description" : "đắng như semen vậy :))",
        "name" : "bitter",
    })
    await taste1.save()
    await taste2.save()
    await taste3.save()

    //danh mục
    const category1 = new Category({
        "name": "Breakfast",
	    "child": [{
            "name": "Noodles & Pho",
            "description": "Traditional food in VietName, good choice to start your day"
        },{
            "name": "Bread and other friends"
        }]
    })
    // const category2 = new Category({
    //     "name": "desert",
	//     "description": "appetizer food"
    // })
    // const category3 = new Category({
    //     "name": "drinks",
	//     "description": "drinks helps your food much tastier, or makes your digest much easier"
    // })
    // const category4 = new Category({
    //     "name": "dried food",
	//     "description": "well... those food are dried up"
    // })

    await category1.save()
    // await category2.save()
    // await category3.save()
    // await category4.save()
    //tạo 20 sản phẩm
    const dish1 = new Dish({
        "name": "Fried Rice",
        "description": "Cơm bỏ lên chảo rồi chiên :)",
        "price": 5,
        "promotionprice": 4.5,
        "kcal": 100
    })
    const dish2 = new Dish({
        "name": "Muffer",
        "description": "Thịt băm nhồi trứng, và được chiên lên",
        "price": 10,
        "promotionprice": 9,
        "kcal": 100
    })
    const dish3 = new Dish({
        "name": "pudding",
        "description": "a gel-like appetizer food",
        "price": 10,
        "promotionprice": 9,
        "kcal": 100
    })
    const dish4 = new Dish({
        "name": "cocacola",
        "description": "nice drink that drives out your thirsty",
        "price": 1,
        "promotionprice": 0,
        "kcal": 100
    })
    // const dish5 = new Dish({})
    // const dish6 = new Dish({})
    // const dish7 = new Dish({})
    // const dish8 = new Dish({})
    // const dish9 = new Dish({})
    // const dish10 = new Dish({})
    // const dish11 = new Dish({})
    // const dish12 = new Dish({})
    // const dish13 = new Dish({})
    // const dish14 = new Dish({})
    // const dish15 = new Dish({})
    // const dish16 = new Dish({})
    // const dish17 = new Dish({})
    // const dish18 = new Dish({})
    // const dish19 = new Dish({})
    // const dish20 = new Dish({})

    await dish1.save()
    await dish2.save()
    await dish3.save()
    await dish4.save()
    // await dish5.save()
    // await dish6.save()
    // await dish7.save()
    // await dish8.save()
    // await dish9.save()
    // await dish10.save()
    // await dish11.save()
    // await dish12.save()
    // await dish13.save()
    // await dish14.save()
    // await dish15.save()
    // await dish16.save()
    // await dish17.save()
    // await dish18.save()
    // await dish19.save()
    // await dish20.save()
}

module.exports = generateDemoData