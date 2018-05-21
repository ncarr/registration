import Member from '../models/Member'
import UnauthenticatedError from '../util/UnauthenticatedError'
import getAuthenticatedUser from '../util/getAuthenticatedUser'

export default async req => {
  if (!await getAuthenticatedUser(req) && await Member.findOne({ email: req.body.email }).exec()) {
    throw new UnauthenticatedError()
  }
}
