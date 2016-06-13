import Express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import path from 'path'
import expressJwt from 'express-jwt'
import morgan from 'morgan'

import i18n from './i18n-server'
import i18nMiddleware from 'i18next-express-middleware'
import { getToken } from './util/fetchData'
import configRoutes from './routes'
import * as config from '../shared/config'

// Initialize the Express App
const app = new Express()

if (['production', 'testing'].indexOf(process.env.NODE_ENV) === -1) {
  // Webpack Requirements
  const webpack = require('webpack')
  const webpackConfig = require('../webpack.config.dev')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')

  const compiler = webpack(webpackConfig)
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }))
  app.use(webpackHotMiddleware(compiler))
}

// Force SSL connection in production
// ==================================
if (process.env.NODE_ENV === 'production') {
  app.use(forceSsl)
}

// Express middleware
// ==================
app.use(i18nMiddleware.handle(i18n))
app.use(cookieParser())
app.use(bodyParser.json({ limit: '20mb' }))
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }))
app.use(Express.static(path.resolve(__dirname, '../static')))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Authentication
// ==============
app.use(expressJwt({
  secret: config.jwt.secret,
  credentialsRequired: false,
  getToken
}))

// Serve the Routes
// ================
configRoutes(app)

// Helper configurations
// =====================
function forceSsl (req, res, next) {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(['https://', req.get('Host'), req.url].join(''))
  }
  return next()
}

// Unhandled rejection error handler
process.on('unhandledRejection', function (reason, promise) {
  console.log('Possibly Unhandled Rejection', reason.stack) // eslint-disable-line
})

// Start App
// =========
if (process.env.NODE_ENV !== 'testing') {
  app.listen(config.port, (error) => {
    if (!error) {
      console.log(`Maecen is running on port: ${config.port}! Build something amazing!`) // eslint-disable-line
    }
  })
}

export default app
