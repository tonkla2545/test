const express = require('express');
const router = express.Router();
const expressSession = require('express-session')
router.use(expressSession({
    secret: "node secret"
}))


const userController = require('../controller/userController')
const auth = require('../middleware/auth')

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get('/logout',userController.logout)
router.post('/user/register',userController.register)
router.post('/user/login',userController.login)
router.put('/editProfile/:id',userController.editProfile)
router.put('/changePassword',userController.changePassword)
router.delete('/deleteUser/:id',userController.deleteUser)
router.post('/welcome',auth,userController.welcome)

module.exports = router;
