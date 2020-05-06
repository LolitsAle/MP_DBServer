const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        trim: true
    },
    password : {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contains "password"')
            }
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid!')
            }
        }
    },
    isactive: {
        type: Boolean,
        default:false
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0) {
                throw  new Error('Tuổi phải là một số nguyên dương')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]
})

userSchema.methods.consolelog = async function() {
    console.log(this)
}

//Lọc dữ liệu trước khi trả client


//Hàm cấp token cho user
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id : user._id.toString()}, "Thisistest" )

    //adding tokens to the user data
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

//Hàm kiểm tra thông tin đăng nhập
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})

    if(!user) { throw new Error('Unable to login')}

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error('Unable to login')
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