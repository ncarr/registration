import { Router, json } from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import organizer from './middleware/organizer'
import authenticated from './middleware/authenticated'
import Member from './models/Member'
import genToken from './util/genToken'
import getAuthenticatedUser from './util/getAuthenticatedUser'

const router = Router()
mongoose.connect('mongodb://localhost/registration')
  .catch(() => console.error('Could not initially connect to MongoDB'))

router.use(json())
router.use(cookieParser())

/* GET users listing. */
// TODO: pagination
router.get('/users', organizer, (req, res, next) =>
  Member.find().exec()
    .then(::res.json)
    .catch(next)
)

// TODO: pagination
// Q: Should we include accepted attendees?
router.get('/applicants', organizer, (req, res, next) =>
  Member.find({ status: 1 }).exec()
    .then(::res.json)
    .catch(next)
)

// TODO: pagination
router.get('/attendees', organizer, (req, res, next) =>
  Member.find({ status: 5 }).exec()
    .then(::res.json)
    .catch(next)
)
/* GET user by ID. */
// TODO: Filter to information available to user
router.get('/users/me', authenticated, (req, res) => res.json(req.user))
router.get('/users/me/application/status', authenticated, (req, res) => res.send({ data: req.user.status }))

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
        throw new Error('Please sign in')
      }
      member = await Member.create({ ...req.body, tokens: [await genToken()] })
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

// TODO: email notification
// TODO: stop people from resubmitting after the application deadline
router.post('/users/me/application/submit', authenticated, (req, res, next) =>
  Promise.resolve()
    .then(() => req.user.set({ submitted: Date.now(), status: 1 }))
    .then(() => req.user.save())
    .then(::res.json)
    .catch(next)
)

export default router
