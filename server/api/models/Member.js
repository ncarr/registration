import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  // Metadata
  email: { type: String, required: true, unique: true },
  roles: [String],
  tokens: [String],
  // Profile
  name: String,
  phone: String,
  birth: String,
  dietaryRestrictions: String,
  specialNeeds: String,
  school: String,
  city: String,
  province: String,
  country: String,
  pronouns: String,
  // Application
  shirtSize: String,
  achievement: String,
  links: String,
  other: String,
  // Application status
  submitted: Date,
  accepted: Date,
  status: { type: Number, default: 0 } // 0 - unsubmitted, 1 - submitted/under review, 2 - rejected, 3 - accepted, 4 - can't come, 5 - going
})

export default mongoose.model('Member', schema)
