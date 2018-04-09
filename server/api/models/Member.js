import mongoose from 'mongoose'

let schema = new mongoose.Schema({
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
  submitted: Boolean,
  accepted: Boolean,
  going: Boolean
})

export default mongoose.model('Member', schema)
