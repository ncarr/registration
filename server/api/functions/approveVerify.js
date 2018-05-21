import jwt from 'jsonwebtoken'
import Member from '../models/Member'
import { publicKey } from '../keys'

export default async ({ params: { token } }) => {
  const { verify } = jwt.verify(token, publicKey, { algorithms: ['ES256'] })
  if (!verify) {
    throw new Error('Invalid token')
  }
  const member = await Member.findOne({ email: verify }).exec()
  member.emailVerified = true
  delete member.previousEmail
  delete member.previousEmailVerified
  await member.save()
}
