import getAuthenticatedUser from '../util/getAuthenticatedUser'

export default async (req, res, next) => {
  try {
    const member = await getAuthenticatedUser(req)
    if (member) {
      if (member.roles.contains('organizer')) {
        req.user = member
        return next()
      }
      throw new Error('Not an organizer')
    }
    throw new Error('Please sign in')
  } catch (e) {
    return next(e)
  }
}
