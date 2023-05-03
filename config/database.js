const mongoose = require('mongoose')

const { MONGO_URL } = process.env

exports.connect = () =>{
    
    mongoose.connect(MONGO_URL , {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
        // useFindAndModify: false
    }).then(() =>{
        console.log("Successfully connect")
    }).catch((err) =>{
        console.log("Error connect")
        console.error(err)
        process.exit(1)
    })
}