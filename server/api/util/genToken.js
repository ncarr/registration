import crypto from 'crypto'

export default () =>
  new Promise((resolve, reject) =>
    crypto.randomBytes(48, (err, buffer) => {
      if (err) return reject(err)
      resolve(buffer.toString('base64'))
    })
  )
