import Member from '../models/Member'

export default req => {
  if (req.cookies && req.cookies.token) {
    return Member.findOne({ tokens: req.cookies.token }).exec()
  }
  return null
}
