const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name:{type:String, default: null},
    price:{type:Number, default: null},
    image:{type:String},
    description:{type:String, default: null}
    
})

module.exports = mongoose.model('Product', productSchema)
