import { resolve } from 'path'
import { Router, json } from 'express'
import { OAuth2Client } from 'google-auth-library'
import Email from 'email-templates'
import transport from 'nodemailer-mailgun-transport'
import jwt from 'jsonwebtoken'
import Member from './models/Member'
import { privateKey, publicKey } from './keys'
import getAuthenticatedUser from './util/getAuthenticatedUser'
import genToken from './util/genToken'
import UnauthenticatedError from './util/UnauthenticatedError'
import authenticated from './middleware/authenticated'

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

router.post('/signin/email', json(), async (req, res, next) => {
  try {
    const member = await Member.findOne({ email: req.body.email }).exec()
    if (!member) {
      throw new Error('We can\'t find an account with that email. Check for any typos and try again')
    } else if (!member.emailSignInEnabled) {
      throw new Error('Sign in through email is disabled for this account. Sign in with Google instead.')
    }
    const token = jwt.sign({ signIn: req.body.email }, privateKey, { expiresIn: '15 minutes', algorithm: 'ES256' })
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
    // TODO: make each Google account exclusive to one account
    const ticket = await client.verifyIdToken({
      idToken: req.body.token,
      audience: process.env.CLIENT_ID
    })
    const payload = ticket.getPayload()
    const signedIn = await getAuthenticatedUser(req)
    const attached = await Member.findOne({ googleID: payload.sub }).exec()
    const matchingEmail = await Member.findOne({ email: payload.email }).exec()
    // If someone has already attached the account to their email
    if (attached) {
      if (!signedIn) {
        const token = await genToken()
        attached.tokens.push(token)
        await attached.save()
        res.cookie('token', token, { maxAge: 365 * 24 * 60 * 60 * 1000 })
        res.send('OK')
      } else {
        throw new UnauthenticatedError('Signing into Google would sign you out since someone else has already attached their Google account')
      }
    // If someone is signed in or there is account with a matching email and they have verified their email with google, connect their google account
    } else if (signedIn || (payload.email_verified && matchingEmail)) {
      const member = signedIn || matchingEmail
      if (!signedIn) {
        if (!member.googleSignInEnabled) {
          throw new Error('Sign in through Google is disabled for this account. Sign in with email instead.')
        }
        const token = await genToken()
        member.tokens.push(token)
        res.cookie('token', token, { maxAge: 365 * 24 * 60 * 60 * 1000 })
      }
      member.googleID = payload.sub
      member.emailVerified = member.emailVerified || (!member.email && payload.emailVerified)
      member.email = member.email || payload.email
      member.name = member.name || payload.name
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
    res.send('OK')
  } catch (e) {
    next(e)
  }
})

router.post('/signout', (req, res, next) => {
  res.clearCookie('token')
  res.send('OK')
})

router.post('/signoutother', authenticated, async (req, res, next) => {
  req.user.tokens = [req.cookies.token]
  await req.user.save()
  res.send('OK')
})

router.put('/users/me/email', authenticated, json(), async (req, res, next) => {
  try {
    if (req.user.email === req.body.email) {
      throw new Error('This is already your email')
    } else if (await Member.findOne({ email: req.body.email }).exec()) {
      throw new Error('An account with this email already exists. Please disconnect this email from that account first.')
    }
    if (req.body.email === req.user.previousEmail) {
      req.user.email = req.user.previousEmail
      req.user.emailVerified = req.user.previousEmailVerified
      delete req.user.previousEmail
      delete req.user.previousEmailVerified
      await req.user.save()
      res.send('Reset to previous email')
      return
    }
    const token = jwt.sign({ verify: req.body.email }, privateKey, { algorithm: 'ES256' })
    emailService.send({
      template: 'verify',
      message: { to: req.body.email },
      locals: { token }
    })
    req.user.previousEmail = req.user.email
    req.user.previousEmailVerified = req.user.emailVerified
    req.user.email = req.body.email
    req.user.emailVerified = false
    await req.user.save()
    res.sendStatus(201)
  } catch (e) {
    next(e)
  }
})

router.post('/verify/:token/cancel', async (req, res, next) => {
  try {
    const { verify } = jwt.verify(req.params.token, publicKey, { algorithms: ['ES256'] })
    if (!verify) {
      throw new Error('Invalid token')
    }
    const member = await Member.findOne({ email: verify }).exec()
    member.email = member.previousEmail
    member.emailVerified = member.previousEmailVerified
    delete member.previousEmail
    delete member.previousEmailVerified
    await member.save()
    res.send('OK')
  } catch (e) {
    next(e)
  }
})

router.post('/verify/:token/approve', async (req, res, next) => {
  try {
    const { verify } = jwt.verify(req.params.token, publicKey, { algorithms: ['ES256'] })
    if (!verify) {
      throw new Error('Invalid token')
    }
    const member = await Member.findOne({ email: verify }).exec()
    member.emailVerified = true
    delete member.previousEmail
    delete member.previousEmailVerified
    await member.save()
    res.send('OK')
  } catch (e) {
    next(e)
  }
})

router.post('/users/me/resendverification', authenticated, json(), async (req, res, next) => {
  try {
    if (req.user.emailVerified) {
      throw new Error('Your email has already been verified.')
    }
    const token = jwt.sign({ verify: req.user.email }, privateKey, { algorithm: 'ES256' })
    emailService.send({
      template: 'verify',
      message: { to: req.user.email },
      locals: { token }
    })
    res.sendStatus(201)
  } catch (e) {
    next(e)
  }
})

export default router
