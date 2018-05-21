import jwt from 'jsonwebtoken'
import emailService from '../util/emailService'
import { privateKey } from '../keys'

// TODO: stop people from resubmitting after the application deadline
export default async ({ user }, res) => {
  if (!user.emailVerified) {
    const token = jwt.sign({ submit: user.email }, privateKey, { algorithm: 'ES256' })
    emailService.send({
      template: 'submit',
      message: { to: user.email },
      locals: { token }
    })
  } else {
    user.set({ submitted: Date.now(), status: 1 })
    await user.save()
    res.status(201)
  }
}
