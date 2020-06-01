const express = require('express')
const router = new express.Router()

const auth = require('../middleware/auth')

const userTable = require('../models/usertable')
const Dish = require('../models/dish')
const Order = require('../models/order')

const paypal = require('@paypal/checkout-server-sdk')
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
const payPalClient = require('../utils/paypalClient')
const {shippingfee} = require('../utils/getWebdata')

//hàm thanh toán (client gọi CreateOrder và gửi data bàn ăn lên)
//server => lấy data usertable theo id và cập nhật vào data order
router.post('/users/me/table/:tableid/checkout',auth , async (req, res) => {
    try {
        // console.log('USER ID: ' + req.user._id)
        // console.log('TABLE ID: '+ req.params.tableid)
        // 1. Find table and construct paypal data

        const table = await userTable.findOne({
            userid : req.user._id, 
        // _id : req.body.table
        })
        
        const finalprice = table.totalprice + shippingfee
        
        if(table.totalprice == 0){
            throw new Error('There are no dishes on your table')
        }
        // run foreach và tìm data đồ vào data paypal
        const items = []
        var counter = 0

        //để async foreach chạy phải để trong promise
        const code = new Promise(function(resolve, reject) {
            table.dishes.forEach(async element => {
                
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
                order = await payPalClient.client().execute(request);
            } catch (err) {

                // 4. Handle any errors from the call
                return res.send(500);
            }

            // 5. Tạo 1 order mới và lưu lại
            //console.log(order)
            const newOrder = new Order({
                online: true,
                finalprice: finalprice,
                user: req.user._id,
                items: table.dishes,
                discountpercent: 0,
                discountnumber: 0,
                paymentmethod: {
                    paymentname: 'PayPal',
                    paymentid: order.result.id
                }
            })

            await newOrder.save()

            // 6. Return a successful response to the client with the order ID
            res.status(200).json({
                orderID: order.result.id
            });
        })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/users/me/order/completepayment', async (req, res) => {
    // 2a. Get the order ID from the request body
    const orderID = req.body.orderID;

    // 3. Call PayPal to get the transaction details
    let request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderID);

    let order;
    try {
        order = await payPalClient.client().execute(request);
    } catch (err) {

        // 4. Handle any errors from the call
        console.error(err);
        return res.send(500);
    }

    // 5. Kiểm tra dữ liệu thanh toán có chính xác hay không
    //console.log(order)

    // 6.1 Lưu thay đổi vào database
    // await database.saveTransaction(orderID);
    //move to promises
    if(order.statusCode == 200) {
        const t_order = await Order.findOne({'paymentmethod.paymentid' : order.result.id})
        console.log(t_order)
        // 6.2 thay đổi thông tin đơn hàng
        t_order.paymentmethod.status = 'Complete'
        t_order.status = 'Payment completed, waiting for confirmation'

        await t_order.save()

        // 7. Trả kết qua về cho Client => hiện thông báo
        return res.status(200).json({
            orderID: t_order._id
        });
    }
})

router.get('/users/me/orders', auth, async (req, res) => {
    try {
        await req.user.populate({
            path: 'orders',
            populate: {
                path : 'items.dish'
            }
        }).execPopulate()

        res.send(req.user.orders)
    } catch (error) {
        res.status(400).send({error : error.message})
    }
})
module.exports = router