import jwt from 'jsonwebtoken'
import Member from '../models/Member'
import { publicKey } from '../keys'

export default async ({ params: { token } }) => {
  const { submit } = jwt.verify(token, publicKey, { algorithms: ['ES256'] })
  if (!submit) {
    throw new Error('Invalid token')
  }
  const member = await Member.findOne({ email: submit }).exec()
  member.status = 1
  member.emailVerified = true
  await member.save()
}
