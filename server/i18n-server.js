// Imports
import i18n from 'i18next'
import Backend from 'i18next-node-fs-backend'
import { LanguageDetector } from 'i18next-express-middleware'

import { interpolation } from '../shared/i18n'

export default i18n
  .use(Backend)
  .use(LanguageDetector)
  .init({
    whitelist: ['en', 'da'],
    fallbackLng: 'en',

    // have a common namespace used around the full app
    ns: ['common', 'frontpage'],
    defaultNS: 'common',

    debug: false,

    interpolation,

    backend: {
      loadPath: 'locales/{{lng}}/{{ns}}.json',
      jsonIndent: 2
    },

    detection: {
      order: ['cookie', 'header'],
      lookupCookie: 'i18n'
    }
  })
