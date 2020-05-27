const express = require('express')
const router = new express.Router()

const auth = require('../middleware/auth')

const paypal = require('@paypal/checkout-server-sdk')
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
const payPalClient = require('../utils/paypalClient')

//hàm thanh toán (client gọi CreateOrder và gửi data bàn ăn lên)
//server => lấy data usertable theo id và cập nhật vào data order
router.post('/users/me/table/:tableid/checkout', async (req, res) => {
    console.log('checkout running')

    console.log('TABLE ID: '+ req.params.tableid)
    
    // 2. Allow cross-domain
    res.setHeader('access-control-allow-origin', '*');

     // 3. Call PayPal to set up a transaction
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: '220.00'
            }
            }]
        });

        let order;
        try {
            order = await payPalClient.client().execute(request);
        } catch (err) {

            // 4. Handle any errors from the call
            console.error(err);
            return res.send(500);
        }

        // 5. Return a successful response to the client with the order ID
        res.status(200).json({
            orderID: order.result.id
        });
})

module.exports = router