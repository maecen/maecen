// Imports
import i18n from 'i18next'
import moment from 'moment'

export default i18n
  .init({
    whitelist: ['en', 'da'],
    fallbackLng: 'en',

    // have a common namespace used around the full app
    ns: ['common'],
    defaultNS: 'common',

    interpolation: {
      escapeValue: false, // not needed for react!!
      formatSeparator: ',',
      format: (value, formatting, lng) => {
        if (value instanceof Date) {
          return moment(value).locale(lng).format(formatting)
        } else if (value instanceof moment) {
          return value.locale(lng).format(formatting)
        }
        return value.toString()
      }
    }
  })
