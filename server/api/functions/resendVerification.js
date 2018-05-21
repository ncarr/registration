import jwt from 'jsonwebtoken'
import emailService from '../util/emailService'
import { privateKey } from '../keys'

export default async ({ user: { email, emailVerified } }, res) => {
  if (emailVerified) {
    throw new Error('Your email has already been verified.')
  }
  const token = jwt.sign({ verify: email }, privateKey, { algorithm: 'ES256' })
  emailService.send({
    template: 'verify',
    message: { to: email },
    locals: { token }
  })
  res.status(201)
}
