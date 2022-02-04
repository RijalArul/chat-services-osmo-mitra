const User = require('../models/user')

class UserController {
  static async create (req, res) {
    try {
      const {
        user_id,
        role,
        full_name,
        mitra_province_id,
        province_id,
        province_name,
        mitra_city_id,
        city_id,
        city_name
      } = req.body

      const payload = {
        user_id: user_id,
        role: role,
        full_name: full_name,
        mitra_province_id: mitra_province_id,
        province_id: province_id,
        province_name: province_name,
        mitra_city_id: mitra_city_id,
        city_id: city_id,
        city_name: city_name
      }

      const users = await User.create(payload)
      res.status(201).json({
        users: users
      })
    } catch (err) {
      if (err.name === 'ValidationError' || err.code === 11000) {
        const error = [err].map(errs => {
          return errs.message
        })
        res.status(400).json({
          error: error
        })
      } else {
        res.status(500).json({
          status: false,
          message: 'Internal Server Error',
          err: err
        })
      }
    }
  }

  static async find (req, res) {
    try {
      const { user_id } = req.params
      const user = await User.findOne({
        user_id: user_id
      })

      if (user.role === 'Super Admin') {
        const users = await User.find({
          user_id: { $ne: user_id },
          role: 'Mitra Provinsi'
        })
        res.status(200).json({
          users: users
        })
      } else if (user.role === 'Mitra Provinsi') {
        const users = await User.find().or([
          { role: 'Mitra Kota', mitra_province_id: user.mitra_province_id },
          { role: 'Super Admin' },
          { role: 'Mitra Provinsi' }
        ])

        res.status(200).json(users)
      } else if (user.role === 'Mitra Kota') {
        const users = await User.find().or([
          { role: 'Mitra Kota', mitra_province_id: user.mitra_province_id }
        ])

        res.status(200).json({
          users: users
        })
      }
    } catch (err) {
      res.status(500).json({
        message: 'Internal Server Error'
      })
    }
  }

  static async all (req, res) {
    try {
      const users = await User.find()

      res.status(200).json({
        users: users
      })
    } catch (err) {
      res.status(500).json({
        message: 'Internal Server Error'
      })
    }
  }

  static async get_user (req, res, next) {
    try {
      const { user_id } = req.params
      const user = await User.findOne({
        user_id: user_id
      })

      res.status(200).json({
        user: user
      })
    } catch (err) {
      next()
      // res.status(500).json({
      //   message: 'Internal Server Error'
      // })
    }
  }
}

module.exports = UserController
