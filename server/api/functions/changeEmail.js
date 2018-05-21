import jwt from 'jsonwebtoken'
import Member from '../models/Member'
import emailService from '../util/emailService'
import { privateKey } from '../keys'

export default async ({ user, body: { email } }, res) => {
  if (user.email === email) {
    throw new Error('This is already your email')
  } else if (await Member.findOne({ email }).exec()) {
    throw new Error('An account with this email already exists. Please disconnect this email from that account first.')
  }
  if (email === user.previousEmail) {
    user.email = user.previousEmail
    user.emailVerified = user.previousEmailVerified
    delete user.previousEmail
    delete user.previousEmailVerified
    await user.save()
    return 'Reset to previous email'
  }
  const token = jwt.sign({ verify: email }, privateKey, { algorithm: 'ES256' })
  emailService.send({
    template: 'verify',
    message: { to: email },
    locals: { token }
  })
  user.previousEmail = user.email
  user.previousEmailVerified = user.emailVerified
  user.email = email
  user.emailVerified = false
  await user.save()
  res.status(201)
}
