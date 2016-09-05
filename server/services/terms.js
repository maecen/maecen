import i18n from '../i18n-server'

export function termsAndConditions () {

  return new Promise((resolve, reject) => {
    i18n.loadLanguages(language, (err) => {
      if (err) return reject(err)

      return i18n.t('termsAndConditions', {
        ns: 'terms',
        lng: language
      })
    })
  })
}
