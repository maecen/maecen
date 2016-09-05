import i18n from 'i18next'
import Backend from 'i18next-node-fs-backend'
import { LanguageDetector } from 'i18next-express-middleware'

export default i18n
  .use(Backend)
  .use(LanguageDetector)
  .init({
    whitelist: ['en', 'da'],
    fallbackLng: 'en',

    // have a common namespace used around the full app
    ns: ['email', 'common', 'terms'],
    defaultNS: 'common',

    debug: false,

    interpolation: {
      escapeValue: false // not needed for react!!
    },

    backend: {
      loadPath: 'locales/{{lng}}/{{ns}}.json5',
      jsonIndent: 2
    },

    detection: {
      order: ['cookie', 'header'],
      lookupCookie: 'i18n'
    }
  })
