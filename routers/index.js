const express = require('express');
const router = express.Router()

const IndexController = require('../controller/indexController')

router.get('/',IndexController.index)
router.get('/register',IndexController.pageRegister)
router.get('/login',IndexController.pageLogin)

module.exports = router