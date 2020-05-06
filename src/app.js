const express = require('express')
require('./database/mongodb')

const userRouter = require('./routers/user')

const app = express()

app.use(userRouter)

const port = process.env.PORT || 3000

app.listen(port,() => {
    console.log('Server is running on port ' + port)
})