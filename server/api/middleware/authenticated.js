import getAuthenticatedUser from '../util/getAuthenticatedUser'

export default async (req, res, next) => {
  try {
    const member = await getAuthenticatedUser(req)
    if (member) {
      req.user = member
      return next()
    }
    throw new Error('Please sign in')
  } catch (e) {
    return next(e)
  }
}
