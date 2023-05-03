const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{type:String, required: [true, 'Please procide username']},
    password:{type:String, required: [true, 'Please procide password']},
    address:{type:String, default: null},
    token : {type :String}
})

module.exports = mongoose.model('User',userSchema)