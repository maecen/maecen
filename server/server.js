import Express from 'express'

import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import path from 'path'
import expressJwt from 'express-jwt'
import morgan from 'morgan'
import serialize from 'serialize-javascript'

import User from './models/user'
import mapInitialState from '../shared/lib/mapInitialState'
import i18n from './i18n-server'
import i18nMiddleware from 'i18next-express-middleware'
import { I18nextProvider } from 'react-i18next'

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

// React And Redux Setup
import { configureStore } from '../shared/store/configureStore'
import { Provider } from 'react-redux'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'

// Import required modules
import getRoutes from '../shared/routes'
import { fetchComponentData } from './util/fetchData'
import apiRoutes from './routes'
import * as config from '../shared/config'

//
// Force SSL connection in production
//
var forceSsl = function (req, res, next) {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(['https://', req.get('Host'), req.url].join(''))
  }
  return next()
}

if (process.env.NODE_ENV === 'production') {
  app.use(forceSsl)
}

//
// Express middleware: Apply body Parser and server public assets and routes
//
app.use(i18nMiddleware.handle(i18n))
app.use(morgan('dev'))
app.use(cookieParser())
app.use(bodyParser.json({ limit: '20mb' }))
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }))
app.use(Express.static(path.resolve(__dirname, '../static')))

//
// Authentication
//
app.use(expressJwt({
  secret: config.jwt.secret,
  credentialsRequired: false,
  getToken: req => req.cookies.id_token
}))

//
// Serve the API
//
app.use('/api', apiRoutes)

// Render Initial HTML
const renderFullPage = (html, initialState, i18n) => {
  const cssPath = '/dist/app.css'
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <!-- TO-DO we need to translate this -->
        <title>Mæcen</title>
        <link rel="stylesheet" href=${cssPath} />
        <link href='https://fonts.googleapis.com/css?family=Roboto:400,500,300italic,700' rel='stylesheet' type='text/css'>
        <link rel="apple-touch-icon" href="/app-icon.png">
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${serialize(initialState)}
          window.__i18n = ${serialize(i18n)}
        </script>
        <script src="/dist/bundle.js"></script>
      </body>
    </html>
  `
}

const renderError = err => {
  const softTab = '&#32;&#32;&#32;&#32;'
  const errTrace = process.env.NODE_ENV !== 'production'
    ? `:<br><br><pre style="color:red">${softTab}${err.stack.replace(/\n/g, `<br>${softTab}`)}</pre>`
    : ''
  return renderFullPage(`Server Error${errTrace}`, {})
}

// Server Side Rendering based on routes matched by React-router.
app.use((req, res, next) => {
  let initialState = {
    app: {
      requireAuthorization: false,
      maecenate: null,
      posts: []
    },
    entities: {
      users: {},
      maecenates: {},
      posts: {}
    }
  }

  return Promise.resolve().then(() => {
    if (req.user) {
      return User.where('id', req.user.userId).fetch()
        .catch(() => {
          // Don't fail if fetching the user fails, just delete the cookie
          res.clearCookie('id_token', { httpOnly: true })
          return null
        })
    }
    return null
  }).then((user) => {
    if (user !== null) {
      user = user.toJSON()
      initialState.app.authUser = user.id
      initialState.entities.users[user.id] = user
    }

    const locale = req.language
    const resources = i18n.getResourceBundle(locale, 'common')
    const i18nClient = {locale, resources}
    const i18nServer = i18n.cloneInstance()
    i18nServer.changeLanguage(locale)

    initialState = mapInitialState(initialState)
    const store = configureStore(initialState)

    const routes = getRoutes(store)

    match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
      if (err) {
        return res.status(500).end(renderError(err))
      }

      if (redirectLocation) {
        return res.redirect(302, redirectLocation.pathname + redirectLocation.search)
      }

      if (!renderProps) {
        return next()
      }

      return fetchComponentData(store, renderProps.components, renderProps.params)
        .then(() => {
          const initialView = renderToString(
            <I18nextProvider i18n={i18nServer}>
              <Provider store={store}>
                <RouterContext {...renderProps} />
              </Provider>
            </I18nextProvider>
          )
          const finalState = store.getState()

          res.status(200).end(renderFullPage(initialView, finalState, i18nClient))
        }).catch(next)
    })
  }).catch(next)
})

// start app
app.listen(config.port, (error) => {
  if (!error) {
    console.log(`Maecen is running on port: ${config.port}! Build something amazing!`); // eslint-disable-line
  }
})

export default app
