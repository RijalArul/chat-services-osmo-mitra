const user_routes = require('./user')
const chat_routes = require('./chat')
const message_routes = require('./message')
const router = require('express').Router()

router.use('/users', user_routes)
router.use('/chats', chat_routes)
router.use('/messages', message_routes)
module.exports = router
