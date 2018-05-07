import getAuthenticatedUser from '../util/getAuthenticatedUser'
import UnauthenticatedError from '../util/UnauthenticatedError'

export default async (req, res, next) => {
  try {
    const member = await getAuthenticatedUser(req)
    if (member) {
      req.user = member
      return next()
    }
    throw new UnauthenticatedError()
  } catch (e) {
    return next(e)
  }
}
