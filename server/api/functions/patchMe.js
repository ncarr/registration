import Member from '../models/Member'
import getAuthenticatedUser from '../util/getAuthenticatedUser'
import genToken from '../util/genToken'
import UnauthenticatedError from '../util/UnauthenticatedError'
import userCanModify from '../util/userCanModify'

// TODO: Send verification email
export default async ({ body, ...req }, res) => {
  let member = await getAuthenticatedUser(req)
  body = Object.keys(body)
    .filter(key => userCanModify.includes(key))
    .reduce((obj, key) => ({ ...obj, [key]: body[key] }), {})
  if (member) {
    member.set(body)
    return member.save()
  } else {
    if (await Member.findOne({ email: body.email }).exec()) {
      throw new UnauthenticatedError()
    }
    member = await Member.create({ ...body, roles: ['applicant'], tokens: [await genToken()] })
    res.cookie('token', member.tokens[0], { maxAge: 365 * 24 * 60 * 60 * 1000 })
    return member
  }
}
