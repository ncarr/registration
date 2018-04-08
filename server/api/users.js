import { Router } from 'express'
import mongoose from 'mongoose'
import organizer from './middleware/organizer'
import Member from './models/Member'

const router = Router()
mongoose.connect('mongodb://localhost/registration')

/* GET users listing. */
router.get('/users', organizer, function (req, res, next) {
  res.json(users)
})

/* GET user by ID. */
router.get('/users/:id', function (req, res, next) {
  const id = parseInt(req.params.id)
  if (id >= 0 && id < users.length) {
    res.json(users[id])
  } else {
    res.sendStatus(404)
  }
})

export default router
