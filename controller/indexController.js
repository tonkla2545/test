const Product = require('../model/product')

class IndexController {
    static index(req,res,next){
        Product.find().then(product =>{
            res.render('index', {product:product})
        }).catch(err => {
            console.log(err);
            res.status(500).send('Error fetching items');
        });
        
    } 

    static pageRegister(req,res,next){
        res.render('register',{
            errors : req.flash('validationError')
        })
    }
    
    static pageLogin(req,res,next){
        res.render('login', {
            
        })
    }
}

module.exports = IndexController