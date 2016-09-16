// Imports
import i18n from 'i18next'
import moment from 'moment'
import Backend from 'i18next-node-fs-backend'
import { LanguageDetector } from 'i18next-express-middleware'

export default i18n
  .use(Backend)
  .use(LanguageDetector)
  .init({
    whitelist: ['en', 'da'],
    fallbackLng: 'en',

    // have a common namespace used around the full app
    ns: ['common'],
    defaultNS: 'common',

    debug: false,

    interpolation: {
      escapeValue: false, // not needed for react!!
      format: (value, formatting, lng) => {
        if (value instanceof Date) {
          return moment(value).format(formatting)
        } else if (value instanceof moment) {
          return value.format(formatting)
        }
        return value.toString()
      }
    },

    backend: {
      loadPath: 'locales/{{lng}}/{{ns}}.json',
      jsonIndent: 2
    },

    detection: {
      order: ['cookie', 'header'],
      lookupCookie: 'i18n'
    }
  })
