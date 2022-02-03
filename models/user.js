const mongoose = require('mongoose')

const user_schema = mongoose.Schema(
  {
    user_id: { type: Number, required: true },
    full_name: { type: String, required: true },
    mitra_province_id: { type: Number },
    province_id: { type: Number },
    province_name: { type: String },
    mitra_city_id: { type: Number },
    city_id: { type: Number },
    city_name: { type: String },
    role: { type: String, required: true },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  { timestaps: true }
)

const User = mongoose.model('User', user_schema)

module.exports = User
