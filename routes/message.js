const MessageController = require('../controllers/message')

const router = require('express').Router()

router.post('/:chat_id', MessageController.create)
router.get('/:chat_id', MessageController.fetch_message)

module.exports = router
