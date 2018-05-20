import { Router, json } from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import organizer from './middleware/organizer'
import authenticated from './middleware/authenticated'
import Member from './models/Member'
import genToken from './util/genToken'
import getAuthenticatedUser from './util/getAuthenticatedUser'
import UnauthenticatedError from './util/UnauthenticatedError'
import middleware from './util/middleware'
import audit from './middleware/audit'
import createUser from './functions/createUser'
import getUser from './functions/getUser'
import updateUser from './functions/updateUser'
import deleteUser from './functions/deleteUser'

const router = Router()
mongoose.connect('mongodb://localhost/registration')
  .catch(() => console.error('Could not initially connect to MongoDB'))

router.use(json())
router.use(cookieParser())

/* GET users listing. */
// TODO: pagination
router.get('/users', organizer, audit(), (req, res, next) =>
  Member.find().exec()
    .then(::res.json)
    .catch(next)
)

// TODO: pagination
// Q: Should we include accepted attendees?
router.get('/applicants', organizer, audit(), (req, res, next) =>
  Member.find({ status: 1 }).exec()
    .then(::res.json)
    .catch(next)
)

// TODO: pagination
router.get('/attendees', organizer, audit(), (req, res, next) =>
  Member.find({ status: 5 }).exec()
    .then(::res.json)
    .catch(next)
)
/* GET user by ID. */
// TODO: Filter to information available to user
router.get('/users/me', authenticated, (req, res) => res.json(req.user))
router.get('/users/me/dashboard', authenticated, (req, res) => res.send({ data: req.user.status, roles: req.user.roles }))

// TODO: Validate profile + application fields (& ensure email exists)
router.patch('/users/me', async (req, res, next) => {
  try {
    let member = await getAuthenticatedUser(req)
    if (member) {
      member.set(req.body)
      await member.save()
      res.json(member)
    } else {
      if (await Member.findOne({ email: req.body.email }).exec()) {
        throw new UnauthenticatedError()
      }
      member = await Member.create({ ...req.body, roles: ['applicant'], tokens: [await genToken()] })
      res.cookie('token', member.tokens[0], { maxAge: 365 * 24 * 60 * 60 * 1000 })
      res.json(member)
    }
  } catch (e) {
    return next(e)
  }
})

// TODO: Validate profile fields
router.patch('/users/me/profile', authenticated, (req, res, next) =>
  Promise.resolve()
    .then(() => req.user.set(req.body))
    .then(() => req.user.save())
    .then(::res.json)
    .catch(next)
)

router.post('/users/me/application/unsubmit', authenticated, (req, res, next) =>
  Promise.resolve()
    .then(() => req.user.set({ submitted: null, status: 0 }))
    .then(() => req.user.save())
    .then(::res.json)
    .catch(next)
)

router.delete('/users/me/google', authenticated, async (req, res, next) => {
  delete req.user.googleID
  await req.user.save()
  res.send('OK')
})

router.put('/users/me/signin/email', authenticated, json(), async (req, res, next) => {
  try {
    if (req.body.enabled) {
      req.user.emailSignInEnabled = true
    } else {
      if (!req.user.googleSignInEnabled) {
        throw new Error('You still need SOME way to sign in!')
      }
      req.user.emailSignInEnabled = false
    }
    await req.user.save()
    res.send('OK')
  } catch (e) {
    next(e)
  }
})

router.put('/users/me/signin/google', authenticated, json(), async (req, res, next) => {
  try {
    if (req.body.enabled) {
      req.user.googleSignInEnabled = true
    } else {
      if (!req.user.emailSignInEnabled) {
        throw new Error('You still need SOME way to sign in!')
      }
      req.user.googleSignInEnabled = false
    }
    await req.user.save()
    res.send('OK')
  } catch (e) {
    next(e)
  }
})

router.get('/users/me/settings', authenticated, (req, res, next) => {
  const { email, emailVerified, emailSignInEnabled, googleSignInEnabled } = req.user
  res.send({ email, emailVerified, emailSignInEnabled, googleSignInEnabled })
})

router.get('/users/me/signedin', async (req, res, next) => {
  if (await getAuthenticatedUser(req)) {
    res.send({ signedIn: true })
  } else {
    res.send({ signedIn: false })
  }
})

router.post('/users', organizer, json(), audit(), middleware(createUser))
router.get('/users/:id', organizer, audit(), middleware(getUser))
router.patch('/users/:id', organizer, json(), audit(async req => ({
  before: await Member.findById(req.params.id).exec()
})), middleware(updateUser))
router.delete('/users/:id', organizer, audit(async req => ({
  before: await Member.findById(req.params.id).exec()
})), middleware(deleteUser))

export default router
