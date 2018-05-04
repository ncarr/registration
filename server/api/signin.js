import { resolve } from 'path'
import { Router, json } from 'express'
import Email from 'email-templates'
import transport from 'nodemailer-mailgun-transport'
import jwt from 'jsonwebtoken'
import User from './models/Member'
import { privateKey } from './keys'

const router = Router()

const emailService = new Email({
  message: {
    from: process.env.FROM_EMAIL
  },
  transport: transport({
    auth: {
      api_key: process.env.MAILGUN_KEY,
      domain: process.env.MAILGUN_DOMAIN
    }
  }),
  views: {
    root: resolve('./emails'),
    options: {
      extension: 'ejs'
    }
  },
  htmlToText: false,
  juice: true,
  juiceResources: {
    preserveImportant: true,
    webResources: {
      relativeTo: resolve('./emails/assets')
    }
  }
})

router.post('/signin', json(), async (req, res, next) => {
  try {
    if (!await User.findOne({ email: req.body.email })) {
      throw new Error('We can\'t find an account with that email. Check for any typos and try again')
    }
    const token = jwt.sign({ email: req.body.email }, privateKey, { expiresIn: '15 minutes', algorithm: 'ES256' })
    emailService.send({
      template: 'signin',
      message: { to: req.body.email },
      locals: { token }
    })
    res.send('OK')
  } catch (e) {
    return next(e)
  }
})

export default router
