const mongoose = require('mongoose')
const {ConnectionString} = require('../../config/webdata.json')

mongoose.connect(ConnectionString,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, (error) => {
    if(error) return console.log(error)
    console.log('connected to database... ready to work')
})