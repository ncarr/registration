import mongoose from 'mongoose'

let schema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  roles: [String],
  tokens: [String],
  application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' }
})

export default mongoose.model('Member', schema)
