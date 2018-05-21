import jwt from 'jsonwebtoken'
import Member from '../models/Member'
import emailService from '../util/emailService'
import { privateKey } from '../keys'

export default async ({ body: { email } }) => {
  const member = await Member.findOne({ email }).exec()
  if (!member) {
    throw new Error('We can\'t find an account with that email. Check for any typos and try again')
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
