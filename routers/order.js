const express = require('express');
const router = express.Router();

const orderController = require('../controller/orderController')

router.post('/order',orderController.order)
router.get('/showOrder/:id',orderController.showOrder)

module.exports = router