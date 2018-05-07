export default class UnauthenticatedError extends Error {
  constructor (message = 'Please sign in', ...args) {
    super(message, ...args)
    this.code = 'EUNAUTHENTICATED'
    this.status = 401
  }
}
