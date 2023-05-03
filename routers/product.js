const express = require('express');
const router = express.Router();

const productController = require('../controller/productController')

router.post('/add',productController.add)
router.get('/product',productController.product)
router.put('/edit',productController.edit)
router.delete('/deleteProduct/:id',productController.deleteProduct)

module.exports = router