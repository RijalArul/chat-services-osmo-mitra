const Message = require('../models/message')
const User = require('../models/user')
const Chat = require('../models/chat')

class MessageController {
  static async create (req, res) {
    const { content, user_id } = req.body
    const { chat_id } = req.params

    const user = await User.findOne({
      user_id: user_id
    })

    if (!content || !chat_id || !user_id) {
      res.status(400).json({
        message: 'Gagal melakukan message'
      })
    }
    var newMessage = {
      sender: user._id,
      content: content,
      chat: chat_id
    }

    try {
      var message = await Message.create(newMessage)

      message = await message.populate('sender', 'full_name role')
      message = await message.populate('chat')
      message = await User.populate(message, {
        path: 'chat.users',
        select: 'full_name role'
      })

      await Chat.findByIdAndUpdate(chat_id, { latestMessage: message })

      res.json(message)
    } catch (error) {
      res.status(400)
      throw new Error(error.message)
    }
  }

  static async fetch_message (req, res) {
    try {
      const { chat_id } = req.params
      const messages = await Message.find({ chat: chat_id })
        .populate('sender', 'full_name role')
        .populate('chat')
      res.json(messages)
    } catch (err) {
      res.status(500).json({
        message: 'Internal Server Error'
      })
    }
  }
}

module.exports = MessageController
