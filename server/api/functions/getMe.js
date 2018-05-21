import userCanView from '../util/userCanView'

export default ({ user, query: { fields } }) => {
  let keys = []
  if (fields) {
    if (!Array.isArray(fields)) {
      fields = [fields]
    }
    for (const field of fields) {
      if (field === 'dashboard') {
        keys.push('status', 'roles')
      } else if (field === 'settings') {
        keys.push('email', 'emailVerified', 'emailSignInEnabled', 'googleSignInEnabled')
      }
    }
  } else {
    keys = userCanView
  }
  return Object.keys(user.toObject())
    .filter(key => keys.includes(key))
    .reduce((obj, key) => ({ ...obj, [key]: user[key] }), {})
}
