const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { unableToLogin, invalidAge, invalidEmail, emailIsUsed, passwordValidate, nameNotProvided } = require('../utils/getErrMessage')
const { TokenKeyString, TokenExpiredAfter } = require('../utils/getWebdata')

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, nameNotProvided],
        trim: true
    },
    password : {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error(passwordValidate)
            }
        }
    },
    email: {
        type: String,
        unique: [true, emailIsUsed],
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error(invalidEmail)
            }
        }
    },
    isactive: {
        type: Boolean,
        default: false
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value <= 0) {
                throw  new Error(invalidAge)
            }
        }
    },
    role: {
        type: String,
        default: "user"
    },
    tokens: [{
        token: {
            type: String,
        }
    }]
})

//Unique validation message change
userSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
      next(new Error('email must be unique'));
    } else {
      next();
    }
});

userSchema.methods.consolelog = async function() {
    console.log(this)
}

//Lọc dữ liệu trước khi trả client
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject._id
    delete userObject.avatar

    return userObject
}

//Hàm cấp token cho user
userSchema.methods.generateAuthToken = async function () {
    const user = this
    //dùng id để cấp token
    const token = jwt.sign({_id : user._id.toString()}, TokenKeyString, {expiresIn : TokenExpiredAfter} )

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

//Hàm kiểm tra thông tin đăng nhập
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})

    if(!user) { throw new Error(unableToLogin)}

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error(unableToLogin)
    }

    return user
}

//Hashing sẽ luôn được thực hiện khi người dùng lưu User vời thông tin mk mới
userSchema.pre('save', async function (next) {
    const user = this

   //hashing the password
   if(user.isModified('password')){
       user.password = await bcrypt.hash(user.password, 8)
   }

    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User