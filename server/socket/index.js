import Socket from 'socket.io'
import cookie from 'cookie'
import Delta from 'quill-delta'
import Member from '../api/models/Member'
import UnauthenticatedError from '../api/util/UnauthenticatedError'
import userCanModify from '../api/util/userCanModify'

const io = Socket()
const application = io.of('/application')
application.use(async (socket, next) => {
  try {
    const { token } = cookie.parse(socket.handshake.headers.cookie)
    const user = await Member.findOne({ tokens: token }).exec()
    if (!user) {
      throw new UnauthenticatedError()
    }
    socket.user = user
    next()
  } catch (e) {
    next(e)
  }
})

application.on('connection', socket => {
  socket.join(socket.user._id)
  socket.on('update', async ({ field, delta, value }, next) => {
    try {
      if (!userCanModify.includes(field)) {
        throw new Error('Invalid field')
      }
      socket.to(socket.user._id).emit('update', { field, delta, value })
      if (delta) {
        let oldDelta = new Delta()
        if (socket.user[field]) {
          oldDelta = oldDelta.insert(socket.user[field])
        }
        const newDelta = oldDelta.compose(delta)
        socket.user[field] = newDelta.reduce((text, { insert }) => text + insert, '')
      } else {
        socket.user[field] = value
      }
      await socket.user.save()
      next()
    } catch (e) {
      next(e)
    }
  })
})

export default io
