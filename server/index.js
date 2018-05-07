import express from 'express'
import { Nuxt, Builder } from 'nuxt'

const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

app.set('port', port)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')
if (config.dev) {
  const dotenv = require('dotenv').config()
  config.env = { GOOGLE_CLIENT_ID: dotenv.parsed.GOOGLE_CLIENT_ID }
}

// Init Nuxt.js
const nuxt = new Nuxt(config)

// Build only in dev mode
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

const api = require('./api').default
const auth = require('./auth').default

// Import API Routes
app.use('/api', api)
app.use('/signin', auth)

// Give nuxt middleware to express
app.use(nuxt.render)

// Listen the server
app.listen(port, host)
console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
