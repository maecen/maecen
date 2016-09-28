// Imports
import i18n from 'i18next'
import { interpolation } from '../shared/i18n'

export default i18n
  .init({
    whitelist: ['en', 'da'],
    fallbackLng: 'en',

    // have a common namespace used around the full app
    ns: ['common'],
    defaultNS: 'common',

    interpolation
  })
