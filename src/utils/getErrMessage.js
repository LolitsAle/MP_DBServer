const fs = require('fs')
const path = require('path')

const rawdata = fs.readFileSync(path.join(__dirname,'/../', '../config/err_message.json'))
const message = JSON.parse(rawdata)

module.exports = message