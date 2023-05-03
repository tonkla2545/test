const Product = require('../model/product')

class Products {

    static product(req, res, next) {
        Product.find().then(product => {
            res.json(product)
        }).catch(err => {
            next(err)
        })
    }

    static add(req,res,next){
        const { name, price, description} = req.body

        Product.create({name, price, description}).then((product) => {
            res.status(200).json(product)
            console.log(`Inserted Item with ID ${product._id} successfully`);
            // console.log(product);
        }).catch((error) => {
          console.error('Error inserting Item:', error);
          res.status(500).json({ error: 'Error inserting Item' });
        });
    }

    static edit(req,res,next){
        const id = req.body.id
        const { name, price, description} = req.body
        
        if (!id) {
            return res.status(400).send('edit_id is required');
        }

        Product.findByIdAndUpdate(id,{name, price, description},{ new: true, useFindAndModify: false }).then((updateProduct) =>{
            res.status(200).json(updateProduct)
        }).catch((error) => {
            console.error('Error updating item:', error);
            res.status(500).send('Error updating item');
        });
    }

    static deleteProduct(req,res,next){
        Product.findByIdAndDelete(req.params.id).then(post =>{
            res.json(post)
        }).catch(err =>{
            next(err)
        })
    }
}

module.exports = Products