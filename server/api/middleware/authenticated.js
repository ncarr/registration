import getAuthenticatedUser from '../util/getAuthenticatedUser'

export default async (req, res, next) => {
  const member = await getAuthenticatedUser(req).catch(next)
  if (member) {
    req.user = member
    return next()
  }
  next(new Error('Please sign in'))
}
