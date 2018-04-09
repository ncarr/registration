import { Router } from 'express'
import mongoose from 'mongoose'
import organizer from './middleware/organizer'
import authenticated from './middleware/authenticated'
import Member from './models/Member'

const router = Router()
mongoose.connect('mongodb://localhost/registration')

/* GET users listing. */
// TODO: pagination
router.get('/users', organizer, (req, res, next) =>
  Member.find().exec()
    .then(res.json)
    .catch(next)
)

// TODO: pagination
router.get('/applicants', organizer, (req, res, next) =>
  Member.find({ submitted: true }).exec()
    .then(res.json)
    .catch(next)
)

// TODO: pagination
router.get('/attendees', organizer, (req, res, next) =>
  Member.find({ going: true }).exec()
    .then(res.json)
    .catch(next)
)
/* GET user by ID. */
// TODO: Filter to information available to user
router.get('/users/me', authenticated, (req, res) => res.json(req.user))

// TODO: Validate application fields
router.patch('/users/me/application', authenticated, (req, res, next) =>
  req.user.set(req.body).save()
    .then(res.json)
    .catch(next)
)

export default router
