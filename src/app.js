const express = require('express')
const bodyparser = require('body-parser')
require('./database/mongodb')

const userRouter = require('./routers/user')

const app = express()

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))
app.use(userRouter)

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Token" );
    next();
  });

const port = process.env.PORT || 4000


app.get('',(req,res) =>{
    res.send('connected')
})

app.listen(port,() => {
    console.log('Server is running on port ' + port)
})

//===============TEST GROUND===================
