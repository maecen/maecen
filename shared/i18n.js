import moment from 'moment'
import numbro from 'numbro'

numbro.culture('da', require('numbro/languages/da-DK'))
numbro.culture('en', numbro.cultures()['en-US'])

export const interpolation = {
  escapeValue: false, // not needed for react!!
  formatSeparator: ',',
  format: (value, formatting, lng) => {
    if (value instanceof Date) {
      return moment(value).locale(lng).format(formatting)
    } else if (value instanceof moment) {
      return value.locale(lng).format(formatting)
    } else if (typeof value === 'number') {
      numbro.culture(lng)
      return numbro(value).format(formatting)
    }
    return value.toString()
  }
}
