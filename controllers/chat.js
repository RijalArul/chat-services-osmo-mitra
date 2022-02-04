const Chat = require('../models/chat')
const User = require('../models/user')

class ChatController {
  static async access_chat (req, res) {
    try {
      const { user_id, user_id2 } = req.body

      if (!user_id) {
        return res.sendStatus(400)
      }

      var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
          { users: { $elemMatch: { $eq: user_id } } },
          { users: { $elemMatch: { $eq: user_id2 } } }
        ]
      })
        .populate('users')
        .populate('latestMessage')

      isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: 'full_name role'
      })

      if (isChat.length > 0) {
        res.send(isChat[0])
      } else {
        var chatData = {
          chatName: 'sender',
          isGroupChat: false,
          users: [user_id, user_id2]
        }

        try {
          const createdChat = await Chat.create(chatData)
          const FullChat = await Chat.findOne({
            _id: createdChat._id
          }).populate('users')
          res.status(200).json(FullChat)
        } catch (error) {
          res.status(400)
          throw new Error(error.message)
        }
      }
    } catch (err) {
      res.status(500).json({
        message: 'Internal Server Error'
      })
    }
  }

  static async get (req, res) {
    try {
      const { user_id } = req.params
      Chat.find({ users: { $elemMatch: { $eq: user_id } } })
        .populate('users')
        .populate('groupAdmin')
        .populate('latestMessage')
        .sort({ updatedAt: -1 })
        .then(async results => {
          results = await User.populate(results, {
            path: 'latestMessage.sender',
            select: 'full_name role'
          })
          res.status(200).send(results)
        })
    } catch (err) {
      res.status(500).json({
        message: 'Internal Server Error'
      })
    }
  }

  static async create_group_chat (req, res) {
    try {
      const { user_id } = req.params

      const user = await User.findOne({
        user_id: user_id
      })

      var users = []

      users.push(user)

      try {
        const groupChat = await Chat.create({
          chatName: `${user.province_name} group`,
          users: users,
          isGroupChat: true,
          groupAdmin: user
        })

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
          .populate('users')
          .populate('groupAdmin')

        res.status(200).json(fullGroupChat)
      } catch (error) {
        res.status(400)
        throw new Error(error.message)
      }
    } catch (err) {
      res.status(500).json({
        message: 'Internal Server Error'
      })
    }
  }

  static async get_group (req, res) {
    try {
      const { mitra_province_id } = req.params

      const user_id = await User.findOne({
        mitra_province_id: mitra_province_id
      })

      const chat = await Chat.findOne({
        isGroupChat: true,
        groupAdmin: user_id._id
      })

      res.send(chat)
    } catch (err) {
      res.status(500).json({
        message: 'Internal Server Error'
      })
    }
  }

  static async add_to_group (req, res) {
    try {
      const { user_id } = req.body
      const { chat_id } = req.params
      const group_chat = await Chat.find({
        users: {
          $elemMatch: {
            $eq: user_id
          }
        }
      }).populate('users')

      const added = await Chat.findByIdAndUpdate(
        chat_id,
        {
          $push: { users: user_id }
        },
        {
          new: true
        }
      )
        .populate('users')
        .populate('groupAdmin')

      if (!added) {
        res.status(404)
        throw new Error('Chat Not Found')
      } else {
        res.status(200).json(group_chat)
      }
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = ChatController
