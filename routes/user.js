const UserController = require('../controllers/user')

const router = require('express').Router()

router.post('/', UserController.create)
router.get('/search_user/:user_id', UserController.find)
router.get('/', UserController.all)
router.get('/:user_id', UserController.get_user)

module.exports = router
