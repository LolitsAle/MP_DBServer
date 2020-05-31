const express = require('express')
const router = new express.Router()

const auth = require('../middleware/auth')

const userTable = require('../models/usertable')
const Dish = require('../models/dish')

const paypal = require('@paypal/checkout-server-sdk')
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
const payPalClient = require('../utils/paypalClient')
const {shippingfee} = require('../utils/getWebdata')

//hàm thanh toán (client gọi CreateOrder và gửi data bàn ăn lên)
//server => lấy data usertable theo id và cập nhật vào data order
router.post('/users/me/table/:tableid/checkout',auth , async (req, res) => {
    console.log('checkout running')

    // console.log('USER ID: ' + req.user._id)
    // console.log('TABLE ID: '+ req.params.tableid)
    // 1. Find table and construct paypal data

    const table = await userTable.findOne({
        userid : req.user._id, 
       // _id : req.body.table
    })
    
    // run foreach và tìm data đồ vào data paypal
    const items = []
    var counter = 0

    //để async foreach chạy phải để trong promises
    const code = new Promise(function(resolve, reject) {
        table.dishes.forEach(async element => {
            console.log('foreach running');
            
            const pdish = await Dish.findById(element.dish)
            items.push({
                name: pdish.name,
                description: pdish.description,
                unit_amount: {
                    currency_code: 'USD',
                    value: pdish.promotionprice
                },
                quantity: element.quantity
            })
            counter ++
            if(counter === table.dishes.length) {
                resolve()
            }
        })
    })
    
    await code.then(async () => {
        const paypaldata = {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: table.totalprice + shippingfee,
                    breakdown: {
                        item_total:{
                            currency_code: 'USD',
                            value: table.totalprice
                        },
                        shipping: {
                            currency_code: 'USD',
                            value: shippingfee
                        }
                    }
                },
                items: items
            }],
        }

        
        // 2. Allow cross-domain
        res.setHeader('access-control-allow-origin', '*');

        // 3. Call PayPal to set up a transaction
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody(paypaldata);

        let order;
        try {
            console.log('order running');
            order = await payPalClient.client().execute(request);
        } catch (err) {

            // 4. Handle any errors from the call
            console.error(err);
            return res.send(500);
        }
        // 5. Tạo 1 order mới và lưu lại

        // 6. Return a successful response to the client with the order ID
        res.status(200).json({
            orderID: order.result.id
        });
    })

})

module.exports = router