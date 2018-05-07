import { resolve } from 'path'
import { Router, json } from 'express'
import { OAuth2Client } from 'google-auth-library'
import Email from 'email-templates'
import transport from 'nodemailer-mailgun-transport'
import jwt from 'jsonwebtoken'
import Member from './models/Member'
import { privateKey } from './keys'
import getAuthenticatedUser from './util/getAuthenticatedUser'
import genToken from './util/genToken'
import UnauthenticatedError from './util/UnauthenticatedError'

const router = Router()

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

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
    if (!await Member.findOne({ email: req.body.email }).exec()) {
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

router.post('/signin/google/token', json(), async (req, res, next) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.token,
      audience: process.env.CLIENT_ID
    })
    const payload = ticket.getPayload()
    const signedIn = await getAuthenticatedUser(req)
    const matchingEmail = await Member.findOne({ email: payload.email }).exec()
    // If someone is signed in or there is account with a matching email and they have verified their email with google, connect their google account
    if (signedIn || (payload.email_verified && matchingEmail)) {
      const member = signedIn || matchingEmail
      member.googleID = payload.sub
      member.emailVerified = member.emailVerified || (!member.email && payload.emailVerified)
      member.email = member.email || payload.email
      member.name = member.name || payload.name
      if (!signedIn) {
        const token = await genToken()
        member.tokens.push(token)
        res.cookie('token', token, { maxAge: 365 * 24 * 60 * 60 * 1000 })
      }
      await member.save()
      res.send('OK')
    // If they are signed out and there is no account with a matching email, create an account for them and connect their google account
    } else if (!matchingEmail) {
      const token = await genToken()
      await Member.create({ tokens: [token], email: payload.email, emailVerified: payload.email_verified, googleID: payload.sub, name: payload.name })
      res.cookie('token', token, { maxAge: 365 * 24 * 60 * 60 * 1000 })
      res.send('OK')
      // If there is an account with a matching email, but the google account email is not verified
    } else {
      throw new UnauthenticatedError()
    }
  } catch (e) {
    next(e)
  }
})

router.post('/signin/checkemail', async (req, res, next) => {
  try {
    if (!await getAuthenticatedUser(req) && await Member.findOne({ email: req.body.email }).exec()) {
      throw new UnauthenticatedError()
    }
  } catch (e) {
    next(e)
  }
})

export default router
