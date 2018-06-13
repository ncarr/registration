import userCanModify from '../util/userCanModify'

export default async ({ body, user, ...req }, res) => {
  body = Object.keys(body)
    .filter(key => userCanModify.includes(key))
    .reduce((obj, key) => ({ ...obj, [key]: body[key] }), {})
  user.set(body)
  return user.save()
}
