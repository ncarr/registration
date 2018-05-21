import { resolve } from 'path'
import Email from 'email-templates'
import transport from 'nodemailer-mailgun-transport'

export default new Email({
  message: {
    from: process.env.FROM_EMAIL
  },
  transport: transport({
    auth: {
      api_key: process.env.MAILGUN_KEY,
      domain: process.env.MAILGUN_DOMAIN
    }
  }),
  views: {
    root: resolve('./emails'),
    options: {
      extension: 'ejs'
    }
  },
  htmlToText: false,
  juice: true,
  juiceResources: {
    preserveImportant: true,
    webResources: {
      relativeTo: resolve('./emails/assets')
    }
  }
})
