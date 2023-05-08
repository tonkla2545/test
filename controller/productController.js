const Product = require('../model/product')
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/image/item');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.jpg'); // Change file name to include timestamp
  },
});

const upload = multer({
  storage: storage,
});


class Products {

    static product(req, res, next) {
        Product.find().then(product => {
            res.json(product)
        }).catch(err => {
            next(err)
        })
    }

    static add(req,res,next){
        upload.single('image')(req, res, (err) => {
            if (err instanceof multer.MulterError) {
              // A Multer error occurred when uploading.
              console.error('Error uploading image:', err);
              res.status(500).json({ error: 'Error uploading image' });
            } else if (err) {
              // An unknown error occurred when uploading.
              console.error('Error uploading image:', err);
              res.status(500).json({ error: 'Error uploading image' });
            } else {
              // Everything went fine, get the file name and create the item
              const { name, price, description } = req.body;
              const image = req.file ? req.file.filename : null;

            Product.create({name, price, image, description}).then((product) => {
                res.status(200).json(product)
                console.log(`Inserted Item with ID ${product._id} successfully`);
                // console.log(product);
            }).catch((error) => {
                console.error('Error inserting Item:', error);
                res.status(500).json({ error: 'Error inserting Item' });
                });
            }
        })
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