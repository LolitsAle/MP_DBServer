const fs = require('fs')
const path = require('path')

const rawdata = fs.readFileSync(path.join(__dirname,'/../', '../config/webdata.json'))
const webdata = JSON.parse(rawdata)

module.exports = webdata