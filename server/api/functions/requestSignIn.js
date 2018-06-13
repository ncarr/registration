import jwt from 'jsonwebtoken'
import Member from '../models/Member'
import emailService from '../util/emailService'
import genToken from '../util/genToken'
import { privateKey } from '../keys'

// TODO: Send verification email
export default async ({ body: { email } }, res) => {
  const member = await Member.findOne({ email }).exec()
  if (!member) {
    const member = await Member.create({ roles: ['applicant'], tokens: [await genToken()] })
    res.status(201)
    res.cookie('token', member.tokens[0], { maxAge: 365 * 24 * 60 * 60 * 1000 })
    return member
  } else if (!member.emailSignInEnabled) {
    throw new Error('Sign in through email is disabled for this account. Sign in with Google instead.')
  }
  const token = jwt.sign({ signIn: email }, privateKey, { expiresIn: '15 minutes', algorithm: 'ES256' })
  emailService.send({
    template: 'signin',
    message: { to: email },
    locals: { token }
  })
}
