import Member from '../models/Member'

export default async (req, res, next) => {
  try {
    if (req.session && req.session.token) {
      const member = await Member.findOne({ tokens: req.session.token, roles: 'organizer' }).exec()
      if (member) {
        req.user = member
        return next()
      } else {
        throw new Error('Not signed in as an organizer')
      }
    } else {
      throw new Error('Sign in token is invalid')
    }
  } catch (e) {
    return next(e)
  }
}
