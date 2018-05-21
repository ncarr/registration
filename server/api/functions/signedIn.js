import getAuthenticatedUser from '../util/getAuthenticatedUser'

export default async req => {
  if (await getAuthenticatedUser(req)) {
    return { signedIn: true }
  } else {
    return { signedIn: false }
  }
}
