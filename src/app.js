const express = require('express')
require('./database/mongodb')

const userRouter = require('./routers/user')

const app = express()

app.use(express.json())
app.use(userRouter)

const port = process.env.PORT || 4000


app.get('',(req,res) =>{
    res.send('connected')
})

app.listen(port,() => {
    console.log('Server is running on port ' + port)
})