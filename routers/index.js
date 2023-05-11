const express = require('express');
const router = express.Router()

const IndexController = require('../controller/indexController')
const auth = require('../middleware/auth')

router.get('/',IndexController.index)
router.get('/register',IndexController.pageRegister)
router.get('/login',IndexController.pageLogin)
router.get('/home',auth ,IndexController.pageHome)
router.get('/order',auth ,IndexController.pageOrder)

module.exports = router