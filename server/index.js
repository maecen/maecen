import React from 'react'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import { I18nextProvider } from 'react-i18next'
import serialize from 'serialize-javascript'

import User from './models/User'
import i18n from './i18n-server'
import getRoutes from '../shared/routes'
import { fetchComponentData, getToken } from './util/fetchData'
import { configureStore } from '../shared/store/configureStore'
import mapInitialState from '../shared/lib/mapInitialState'

export default function initialRender (req, res, next) {
  const userId = req.user
    ? req.user.userId
    : null

  const clearCookie = res.clearCookie.bind(res)
  getAuthenticatedUser(userId, clearCookie).then(user => {
    let data = {}

    if (user !== null) {
      data.authToken = getToken(req)
      data.authUserEntity = user.toJSON()
    }

    // Initial Data
    // ============
    const store = initializeStore(data)
    const routes = getRoutes(store)

    // Language Setup
    // ==============
    const locale = req.language
    const resources = i18n.getResourceBundle(locale, 'common')
    const i18nClient = {locale, resources}
    const i18nServer = i18n.cloneInstance()
    i18nServer.changeLanguage(locale)

    // Initial Router Config
    // =====================
    match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
      if (err) {
        return res.status(500).end(renderError(err))
      } else if (redirectLocation) {
        const newLocation = redirectLocation.pathname + redirectLocation.search
        return res.redirect(302, newLocation)
      } else if (renderProps) {
        const { params, components } = renderProps

        return fetchComponentData(store, components, params).then(() => {
          // Needed for radium to do proper SSR with e.g. Media Queries
          const createElement = (Component, props) => (
            <Component
              {...props}
              radiumConfig={{ userAgent: req.headers['user-agent'] }}
            />
          )

          // Initial Render
          // ==============
          const html = renderToString(
            <I18nextProvider i18n={i18nServer}>
              <Provider store={store}>
                <RouterContext {...renderProps} createElement={createElement} />
              </Provider>
            </I18nextProvider>
          )
          const finalState = store.getState()
          const renderedTemplate = renderTemplate(html, finalState, i18nClient)

          res.status(200).end(renderedTemplate)
        }).catch(next)
      } else {
        return res.status(404).send('Not Found')
      }
    })
  }).catch(next)
}

function initializeStore (data) {
  const authUser = data.authUserEntity || null

  return configureStore(mapInitialState({
    user: {
      ids: [],
      authToken: data.authToken || null,
      authUser: authUser && authUser.id
    },
    app: {
      maecenate: null,
      maecenates: [],
      posts: [],
      requireAuthorization: false
    },
    entities: {
      users: data.authToken
        ? { [authUser.id]: authUser }
        : {},
      supports: {},
      posts: {},
      media: {},
      maecenates: {}
    }
  }))
}

function renderError (err) {
  const softTab = '&#32;&#32;&#32;&#32;'
  const errTrace = process.env.NODE_ENV !== 'production'
    ? `:<br><br><pre style="color:red">${softTab}${err.stack.replace(/\n/g, `<br>${softTab}`)}</pre>`
    : ''
  return renderTemplate(`Server Error${errTrace}`, {})
}

function getAuthenticatedUser (userId, clearCookie) {
  return Promise.resolve().then(() => {
    if (userId) {
      return User.where('id', userId).fetch().catch(() => {
        // Don't fail if fetching the user fails, just delete the cookie
        clearCookie('id_token', { httpOnly: true })
        return null
      })
    }
    return null
  })
}

function renderTemplate (html, initialState, i18n) {
  const globalStyle = `
    [type=reset],
    [type=submit],
    button,
    html [type=button] {
      -webkit-appearance: initial;
    }

    a {
      color: white;
      text-decoration: none;
    }
  `
  const style = {
    html: `
      overflow-x: hidden;
      font-family: Roboto, sans-serif;
      font-size: 16px;
      min-height: 100%;
      margin: 0;
      padding: 0;`,
    body: `
      background-image: url('/assets/img/bg.svg');
      min-height: 100%;
      margin: 0;
      padding: 0;
      background-color: #202020;
      background-position: 50%;
      background-size: cover;
      background-attachment: fixed;`
  }
  return `
    <!DOCTYPE html>
    <html style="${style.html}">
      <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="theme-color" content="#262626">
        <!-- TODO we need to translate this -->
        <title>Mæcen</title>
        <style>${globalStyle}</style>
        <link
          href='https://fonts.googleapis.com/css?family=Roboto:400,500,300italic,700'
          rel='stylesheet' type='text/css'>
        <link rel="apple-touch-icon" href="/assets/favicon/app-icon.png">
        <link rel="icon" type="image/png"
          href="/assets/favicon/favicon-32x32.png" sizes="32x32">
        <link rel="icon" type="image/png"
          href="/assets/favicon/favicon-16x16.png" sizes="16x16">
      </head>
      <body style="${style.body}">
        <!-- Extra div to fix isomorphic rendering -->
        <div id="root"><div>${html}</div></div>
        <script>
          window.__INITIAL_STATE__ = ${serialize(initialState)}
          window.__i18n = ${serialize(i18n)}
        </script>
        <script src="/dist/bundle.js"></script>
      </body>
    </html>
  `
}
