const express = require('express')
const bodyparser = require('body-parser')
require('./database/mongodb')

const userRouter = require('./routers/user')
const dishRouter = require('./routers/dish')
const adminRouter = require('./routers/admin')

const app = express()

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))
app.use(userRouter)
app.use(dishRouter)
app.use(adminRouter)

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
// const userTable = require('./models/usertable')
// const user = require('./models/user')
// const testfunction = async () => {
//     // const table = await userTable.findById('5eb69b73719b792e6cfb29b6')
//     // await table.populate('userid').execPopulate()
//     // console.log(table)

//     // const tuser = await user.findById('5eb68a360c711803f4a5ab41')
//     // await tuser.populate('tables').execPopulate()
//     // console.log(tuser.tables)
    
// }
// testfunction()
//===============TEST GROUND===================


