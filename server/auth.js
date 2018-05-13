import { Router, json } from 'express'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import User from './api/models/Member'
import { publicKey } from './api/keys'
import genToken from './api/util/genToken'

const router = Router()

router.get('/approve/:token', json(), cookieParser(), async (req, res, next) => {
  try {
    const { signIn } = jwt.verify(req.params.token, publicKey, { algorithms: ['ES256'] })
    if (!signIn) {
      throw new Error('Invalid token')
    }
    const token = await genToken()
    await User.updateOne({ email: signIn }, { $push: { tokens: token } }).exec()
    res.cookie('token', token, { maxAge: 365 * 24 * 60 * 60 * 1000 })
    res.redirect('/dashboard')
  } catch (e) {
    return next(e)
  }
})

export default router
