import Action from '../models/Action'

export default extend => async (req, res, next) => {
  try {
    let message, after, action
    if (req.body) {
      ({ message, ...after } = req.body)
      req.body = after
    }
    if (extend instanceof Function) {
      action = await extend(req, res, next)
    } else {
      action = extend
    }
    await Action.create({
      endpoint: req.path,
      method: req.method,
      after,
      message,
      user: req.user && req.user._id,
      ...action
    })
    next()
  } catch (e) {
    next(e)
  }
}
