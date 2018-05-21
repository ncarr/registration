import { OAuth2Client } from 'google-auth-library'
import Member from '../models/Member'
import UnauthenticatedError from '../util/UnauthenticatedError'
import getAuthenticatedUser from '../util/getAuthenticatedUser'
import genToken from '../util/genToken'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export default async (req, res) => {
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
    // If they are signed out and there is no account with a matching email, create an account for them and connect their google account
  } else if (!matchingEmail) {
    const token = await genToken()
    await Member.create({ tokens: [token], email: payload.email, emailVerified: payload.email_verified, googleID: payload.sub, name: payload.name })
    res.cookie('token', token, { maxAge: 365 * 24 * 60 * 60 * 1000 })
    // If there is an account with a matching email, but the google account email is not verified
  } else {
    throw new UnauthenticatedError()
  }
}
