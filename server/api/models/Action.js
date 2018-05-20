import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  user: mongoose.Schema.Types.ObjectId,
  message: String,
  endpoint: String,
  method: String,
  before: Object,
  after: Object
})

export default mongoose.model('Action', schema)
