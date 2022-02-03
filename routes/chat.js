const ChatController = require('../controllers/chat')

const router = require('express').Router()

router.post('/', ChatController.access_chat)
router.get('/:user_id', ChatController.get)
router.get('/group_chat/:mitra_province_id', ChatController.get_group)
router.post('/group_chat/:user_id', ChatController.create_group_chat)
router.put('/add_to_group/:chat_id', ChatController.add_to_group)

module.exports = router
