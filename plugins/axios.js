import * as axios from 'axios'
export default ({ req }, inject) => {
  let options = {}
  // The server-side needs a full url to works
  if (process.server) {
    options.baseURL = `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}/api`
    options.headers = req.headers
  } else {
    options.baseURL = '/api'
  }
  inject('axios', axios.create(options))
}
