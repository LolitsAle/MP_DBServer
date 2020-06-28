const User = require('../models/user')
const Category = require('../models/category')
const Dish = require('../models/dish')
const Ingredient = require('../models/ingredient')
const Taste = require('../models/taste')
const CategoryGroup = require('../models/categorygroup')
const UserTable = require('../models/usertable')

const path = require('path')

const fs = require('fs')
const sharp = require('sharp')

const generateDemoData = async function() {
    //lấy ảnh mẫu từ thư mục
    const avatarimages = fs.readFileSync('./src/demo/user_avatar.png', async (err, data) => {
        if(err) throw err
        const buffer = await sharp(data).resize({width: 250, height: 250}).png().toBuffer()

        return buffer
    })
    
    //dễ thôi chỉnh cái này 1 tí à

    const getimages = function(filepath) {
        const filepath2 = path.join(__dirname, '../', 'demo/', filepath)
        const filedata = fs.readFileSync(filepath2, async (err, data) => {
            console.log(data);
            if(err) throw err
            const buffer = await sharp(data).resize({width: 250, height: 250}).png().toBuffer()
            
            return buffer
        })

        return filedata
    }
    //ví dụ : image : getimages('filepath')

    const user1 = new User({
        "isactive" : true,
        "age" : 21,
        "role" : "admin",
        "name" : "Duy Admin",
        "email" : "hoangduy9669@gmail.com",
        "password" : "$2a$08$7NmbwL/38GSBZ4aKCERMWuoP6xPuuiNB5P8xx2VY/QHuO.1k92Yh2",
        "tokens" : [],
        "gender" : "male",
        "address" : "Hồng Bàng TPHCM",
        "password" : "123456789",
        "avatar" : avatarimages
    })
    const user2 = new User({
        "isactive" : true,
        "age" : 13,
        "role" : "user",
        "name" : "Hoàng Duy",
        "email" : "duyd9669@gmail.com",
        "password" : "$2a$08$J3MfRT8N9MZPxcGlmzo4cODK99Z0sJ/VoMLWd7DOV8vWEhLRYxl9G",
        "tokens" : [],
        "gender" : "male",
        "address" : "Hồng Bàng TPHCM",
        "password" : "123456789",
        "avatar": avatarimages
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
    const ingredient4 = new Ingredient({
        "description" : "eggs from industry chickens",
        "source" : "Nature Farm",
        "name" : "Chicken Eggs"
    })

    await ingredient1.save()
    await ingredient2.save()
    await ingredient3.save()
    await ingredient4.save()

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
        "name": "Standard Breakfast",
	    "description": "fk u"
    })
    const category2 = new Category({
        "name": "Desert",
	    "description": "Desert is desert"
    })
    const category3 = new Category({
        "name": "Energy Drinks",
	    "description": "POWERRRR!!!!"
    })
    const category4 = new Category({
        "name": "Nature Drinks",
	    "description": "Want a healthy drink? choose one!"
    })
    const category5 = new Category({
        "name": "SeaFood MealBox",
	    "description": "Is seafood is your favorite? GREAT!!! you can have a box filled with seafood right now!!!"
    })
    
    const categorygroup1 = new CategoryGroup({
        "name": "Breakfast",
        "categories" : [{
            "category" : category1._id
        },{
            "category" : category2._id
        },{
            "category" : category5._id
        }]
    })
    const categorygroup2 = new CategoryGroup({
        "name": "Drinks",
        "categories" : [{
            "category" : category3._id
        },{
            "category" : category4._id
        }]
    })

    await category1.save()
    await category2.save()
    await category3.save()
    await category4.save()
    await category5.save()
    await categorygroup1.save()
    await categorygroup2.save()

    //tạo 20 sản phẩm
    const dish1 = new Dish({
        "name": "Orange Juice",
        "description": "Orange juice is a liquid extract of the orange tree fruit, produced by squeezing or reaming oranges. It comes in several different varieties, including blood orange, navel oranges, valencia orange, clementine, and tangerine. As well as variations in oranges used, some varieties include differing amounts of juice vesicles, known as pulp in American English, and juicy bits in British English. These vesicles contain the juice of the orange and can be left in or removed during the manufacturing process. How juicy these vesicles are depend upon many factors, such as species, variety, and season. In American English, the beverage name is often abbreviated as OJ.",
        "price": 15,
        "promotionprice": 15,
        "kcal": 200,
        "category": category2._id,
        "mainpicture" : getimages('kisspng-orange-juice-cocktail-tequila-sunrise-apple-juice-fruit-cocktail-juice-png-5ab1ad10ada7b6.6397521715215936167113.png'),
        "ingredients": [{
            "ingredient": ingredient1._id
        },{
            "ingredient": ingredient2._id
        }]

    })
    const dish2 = new Dish({
        "name": "Hot Dog",
        "description": "Hot dog means a whole, cured, cooked sausage that is skinless or stuffed in a casing, that may be known as a frankfurter, frank, furter, wiener, red hot, vienna, bologna, garlic bologna, or knockwurst, and that may be served in a bun or roll.",
        "price": 15,
        "promotionprice": 15,
        "kcal": 100,
        "category": category2._id,
        "mainpicture" : getimages('hot_dog_PNG10231.png'),
        "ingredients": [{
            "ingredient": ingredient3._id
        },{
            "ingredient": ingredient2._id
        }]

    })
    const dish3 = new Dish({
        "name": "Omelette2",
        "description": "In cuisine, an omelette or omelet is a dish made from beaten eggs, fried with butter or oil in a frying pan (without stirring as in scrambled egg). It is quite common for the omelette to be folded around fillings such as cheese, chives, vegetables, mushrooms, meat (often ham or bacon), or some combination of the above.",
        "price": 20,
        "promotionprice": 20,
        "kcal": 20,
        "category": category2._id,
        "mainpicture" : getimages('omelette_PNG11.png'),
        "ingredients": [{
            "ingredient": ingredient4._id
        },{
            "ingredient": ingredient3._id
        }]

    })
    const dish4 = new Dish({
        "name": "Wedding cake",
        "description": "A wedding cake is the traditional cake served at wedding receptions following dinner. ... In modern Western culture, the cake is usually on display and served to guests at the reception. Traditionally, wedding cakes were made to bring good luck to all guests and the couple.",
        "price": 30,
        "promotionprice": 30,
        "kcal": 60,
        "category": category3._id,
        "mainpicture" : getimages('wedding_cake_PNG19460.png')
    })
    const dish5 = new Dish({ 

        "name": "Pizza", 
        "description": "Pizza (Italian: [ˈpittsa], Neapolitan: [ˈpittsə]) is a savory dish of Italian origin, consisting of a usually round, flattened base of leavened wheat-based dough topped with tomatoes, cheese, and often various other ingredients (anchovies, olives, meat, etc.) baked at a high temperature, traditionally in a wood-fired ...",
        "price": 1,
        "promotionprice": 1,
        "kcal": 50,
        "category": category3._id,
        "mainpicture" : getimages('pizza_PNG44044.png')
    })
    const dish6 = new Dish({
        "name": "Coca-Cola",
        "description": "The Coca-Cola Company is a beverage retailer, manufacturer and marketer of non-alcoholic beverage concentrates and syrups. The company's flagship product is Coca-Cola, but it offers more than 500 brands in over 200 countries or territories and serves 1.6bn servings each day",
        "price": 10,
        "promotionprice": 10,
        "kcal": 200,
        "category": category1._id,
        "mainpicture" : getimages('coca_cola_PNG8915.png'),
        "ingredients": [{
            "ingredient": ingredient1._id
        }]

    })
    const dish7 = new Dish({
        "name": "Cognac",
        "description": "Cognac is a type of brandy, and after the distillation and during the aging process, is also called eau de vie. It is produced by twice distilling white wines produced in any of the designated growing regions.",
        "price": 50,
        "promotionprice": 50,
        "kcal": 200,
        "category": category1._id,
        "mainpicture" : getimages('cognac_PNG15160.png'),
        "ingredients": [{
            "ingredient": ingredient1._id
        },{
            "ingredient": ingredient2._id
        },{
            "ingredient": ingredient3._id
        }]

    })
    const dish8 = new Dish({
        "name": "Fried chicken",
        "description": "Southern fried chicken, also known simply as fried chicken, is a dish consisting of chicken pieces which have been coated in a seasoned batter and pan-fried, deep fried, or pressure fried. The breading adds a crisp coating or crust to the exterior of the chicken while retaining juices in the meat.",
        "price": 25,
        "promotionprice": 25,
        "kcal": 200,
        "category": category5._id,
        "mainpicture" : getimages('fried_chicken_PNG14105.png'),
        "ingredients": [{
            "ingredient": ingredient1._id
        },{
            "ingredient": ingredient2._id
        },{
            "ingredient": ingredient3._id
        }]
    })
    const dish9 = new Dish({
        "name": "Mashed Potato",
        "description": "Mashed potato (British English) or mashed potatoes (American English and Canadian English), colloquially known as mash (British English), is a dish prepared by mashing boiled potatoes. Milk, butter, salt and pepper are frequently used in preparation. The dish is usually a side dish to meat or vegetables.",
        "price": 2.5,
        "promotionprice": 2.3,
        "kcal": 300,
        "category": category5._id,
        "mainpicture" : getimages('Food-Free-PNG-Image.png'),
        "ingredients": [{
            "ingredient": ingredient1._id
        },{
            "ingredient": ingredient4._id
        },{
            "ingredient": ingredient3._id
        }]
    })
    const dish10 = new Dish({
        "name": "Sandwich",
        "description": "A sandwich is a food typically consisting of vegetables, sliced cheese or meat, placed on or between slices of bread, or more generally any dish wherein bread serves as a container or wrapper for another food type. ... As well as being homemade, sandwiches are also widely sold in restaurants and can be served hot or cold.",
        "price": 2,
        "promotionprice": 2,
        "kcal": 500,
        "category": category5._id,
        "mainpicture" : getimages('Food-PNG-File.png'),
        "ingredients": [{
            "ingredient": ingredient1._id
        },{
            "ingredient": ingredient2._id
        },{
            "ingredient": ingredient3._id
        },{
            "ingredient": ingredient4._id
        }]
    })
    const dish11 = new Dish({
        "name": "Beef fried chopped steaks",
        "description": "Beef fried chopped steaks and chips is an extremely delicious dish that provides plenty of nutrition for the body, enjoy this attractive beef fried dish at SOUL Ben Thanh Restaurant. This is a favorite dish of everyone because of its delicious taste that will awake your taste with softness from beef and sweetness from vegetables and fruits.",
        "price": 10,
        "promotionprice": 9,
        "kcal": 100,
        "category": category2._id,
        "mainpicture" : getimages('Food-PNG-HD.png') // để t chỉnh, ok giờ m bỏ tên ảnh vào thôi
    })
    const dish12 = new Dish({
        "name": "Omelette",
        "description": "According to the founding legend of the annual giant Easter omelette of Bessières, Haute-Garonne, when Napoleon Bonaparte and his army were traveling through southern France, they decided to rest for the night near the town of Bessières. Napoleon feasted on an omelette prepared by a local innkeeper, and thought it was a culinary delight. He then ordered the townspeople to gather all the eggs in the village and to prepare a huge omelette for his army the next day.",
        "price": 10,
        "promotionprice": 9,
        "kcal": 100,
        "category": category2._id,
        "mainpicture" : getimages('omelette_PNG23.png')
    })
    // const dish13 = new Dish({
    //     "name": "pepsi",
    //     "description": "Tung chim teo",
    //     "price": 10,
    //     "promotionprice": 9,
    //     "kcal": 100,
    //     "category": category2._id,
    //     "mainpicture" : dishimages
    // })
    // const dish14 = new Dish({
    //     "name": "pepsi",
    //     "description": "Tung chim teo",
    //     "price": 10,
    //     "promotionprice": 9,
    //     "kcal": 100,
    //     "category": category2._id,
    //     "mainpicture" : dishimages
    // })
    // const dish15 = new Dish({
    //     "name": "pepsi",
    //     "description": "Tung chim teo",
    //     "price": 10,
    //     "promotionprice": 9,
    //     "kcal": 100,
    //     "category": category2._id,
    //     "mainpicture" : dishimages
    // })
    // const dish16 = new Dish({
    //     "name": "pepsi",
    //     "description": "Tung chim teo",
    //     "price": 10,
    //     "promotionprice": 9,
    //     "kcal": 100,
    //     "category": category2._id,
    //     "mainpicture" : dishimages
    // })
    // const dish17 = new Dish({
    //     "name": "pepsi",
    //     "description": "Tung chim teo",
    //     "price": 10,
    //     "promotionprice": 9,
    //     "kcal": 100,
    //     "category": category2._id,
    //     "mainpicture" : dishimages
    // })
    // const dish18 = new Dish({
    //     "name": "pepsi",
    //     "description": "Tung chim teo",
    //     "price": 10,
    //     "promotionprice": 9,
    //     "kcal": 100,
    //     "category": category2._id,
    //     "mainpicture" : dishimages
    // })
    // const dish19 = new Dish({
    //     "name": "pepsi",
    //     "description": "Tung chim teo",
    //     "price": 10,
    //     "promotionprice": 9,
    //     "kcal": 100,
    //     "category": category2._id,
    //     "mainpicture" : dishimages
    // })
    // const dish20 = new Dish({
    //     "name": "pepsi",
    //     "description": "Tung chim teo",
    //     "price": 10,
    //     "promotionprice": 9,
    //     "kcal": 100,
    //     "category": category2._id,
    //     "mainpicture" : dishimages
    // })

    await dish1.save()
    await dish2.save()
    await dish3.save()
    await dish4.save()
    await dish5.save()
    await dish6.save()
    await dish7.save()
    await dish8.save()
    await dish9.save()
    await dish10.save()
    await dish11.save()
    await dish12.save()
    // await dish13.save()
    // await dish14.save()
    // await dish15.save()
    // await dish16.save()
    // await dish17.save()
    // await dish18.save()
    // await dish19.save()
    // await dish20.save()

    const usertable = new UserTable({
        "name": "My first table",
        "userid": user1._id,
        "dishes": [{
            "dish" : dish1._id,
            "quantity": 2
        },{
            "dish" : dish2._id,
            "quantity": 1
        }],
        "__v": 0
    })
}

module.exports = generateDemoData