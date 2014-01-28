
var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')
  , templatePath = path.normalize(__dirname + '/../app/mailer/templates')
  , notifier = {
      service: 'postmark',
      APN: false,
      email: false, // true
      actions: ['comment'],
      tplPath: templatePath,
      key: 'POSTMARK_KEY',
      parseAppId: 'PARSE_APP_ID',
      parseApiKey: 'PARSE_MASTER_KEY'
    }

module.exports = {
  development: {
    db: process.env.DB_URI,
    //db: '',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'Grapple.io'
    },
    github: {
      clientID: process.env.GH_CLIENT_ID,
      clientSecret: process.env.GH_CLIENT_SECRET,
        //clientID: '',
      //clientSecret: '',
      callbackURL: 'http://app.grapple.io/auth/github/callback'
    },
    google: {
     clientID: process.env.G_CLIENT_ID,
    clientSecret: process.env.G_CLIENT_SECRET,
     // clientID: "",
     // clientSecret: "",
      callbackURL: "http://app.grapple.io/auth/google/callback"
    },
    linkedin: {
     clientID: process.env.LI_CLIENT_ID,
        clientSecret: process.env.LI_CLIENT_SECRET,
     // clientID: "",
     // clientSecret: "",
      callbackURL: "http://app.grapple.io/auth/linkedin/callback"
    }
  },
  test: {
    db: process.env.DB_URI,
    //db: '',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'Grapple.io'
    },
    github: {
      clientID: 'APP_ID',
      clientSecret: 'APP_SECRET',
      callbackURL: 'http://app.grapple.io/auth/github/callback'
    },
    google: {
      clientID: "APP_ID",
      clientSecret: "APP_SECRET",
      callbackURL: "http://app.grapple.io/auth/google/callback"
    },
    linkedin: {
      clientID: "CONSUMER_KEY",
      clientSecret: "CONSUMER_SECRET",
      callbackURL: "http://app.grapple.io/auth/linkedin/callback"
    }
  },
  production: {}
}
