import { Router, json } from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'

import organizer from './middleware/organizer'
import authenticated from './middleware/authenticated'
import audit from './middleware/audit'
import middleware from './util/middleware'
import Member from './models/Member'

import requestSignIn from './functions/requestSignIn'
import googleCallback from './functions/googleCallback'
import checkEmail from './functions/checkEmail'

import signOut from './functions/signOut'
import signOutOther from './functions/signOutOther'

import cancelVerify from './functions/cancelVerify'
import approveVerify from './functions/approveVerify'
import approveSubmit from './functions/approveSubmit'

import getMe from './functions/getMe'
import patchMe from './functions/patchMe'
import changeEmail from './functions/changeEmail'
import resendVerification from './functions/resendVerification'
import submitApplication from './functions/submitApplication'
import unsubmit from './functions/unsubmit'
import deleteGoogle from './functions/deleteGoogle'
import emailSignIn from './functions/emailSignIn'
import googleSignin from './functions/googleSignIn'
import signedIn from './functions/signedIn'

import listUsers from './functions/listUsers'
import createUser from './functions/createUser'
import getUser from './functions/getUser'
import updateUser from './functions/updateUser'
import deleteUser from './functions/deleteUser'
import getLog from './functions/getLog';
import getLogAction from './functions/getLogAction'

const router = Router()
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/registration')
  .catch(() => console.error('Could not initially connect to MongoDB'))

router.use(cookieParser())

router.post('/signin/email', json(), middleware(requestSignIn))
router.post('/signin/google/token', json(), middleware(googleCallback))
router.post('/signin/checkemail', json(), middleware(checkEmail))

router.post('/signout', middleware(signOut))
router.post('/signoutother', authenticated, middleware(signOutOther))

router.post('/verify/:token/cancel', middleware(cancelVerify))
router.post('/verify/:token/approve', middleware(approveVerify))
router.post('/submit/:token', middleware(approveSubmit))

router.get('/users/me', authenticated, middleware(getMe))
router.patch('/users/me', json(), middleware(patchMe))
router.put('/users/me/email', authenticated, json(), middleware(changeEmail))
router.post('/users/me/resendverification', authenticated, json(), middleware(resendVerification))
router.post('/users/me/application/submit', authenticated, middleware(submitApplication))
router.post('/users/me/application/unsubmit', authenticated, middleware(unsubmit))
router.delete('/users/me/google', authenticated, middleware(deleteGoogle))
router.put('/users/me/signin/email', authenticated, json(), middleware(emailSignIn))
router.put('/users/me/signin/google', authenticated, json(), middleware(googleSignin))
router.get('/users/me/signedin', middleware(signedIn))

router.get('/users', organizer, audit(), middleware(listUsers))
router.post('/users', organizer, json(), audit(), middleware(createUser))
router.get('/users/:id', organizer, audit(), middleware(getUser))
router.patch('/users/:id', organizer, json(), audit(async req => ({
  before: await Member.findById(req.params.id).exec()
})), middleware(updateUser))
router.delete('/users/:id', organizer, audit(async req => ({
  before: await Member.findById(req.params.id).exec()
})), middleware(deleteUser))
router.get('/log', organizer, middleware(getLog))
router.get('/log/:id', organizer, middleware(getLogAction))

router.use((err, req, res, next) => res.status(err.status || 500).json({ error: { message: err.message, name: err.name, stack: err.stack } }))

export default router
