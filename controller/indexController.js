class IndexController {
    static index(req,res,next){
        res.render('index')
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