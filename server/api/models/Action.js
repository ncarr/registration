import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  message: String,
  endpoint: String,
  method: String,
  before: Object,
  after: Object
})

export default mongoose.model('Action', schema)
