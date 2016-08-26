import { Mandrill } from 'mandrill-api/mandrill'
import moment from 'moment'
import { host } from '../../shared/config'
import * as transactionService from './transactions'
import i18n from '../i18n-server'

const mandrillClient = new Mandrill(process.env.MANDRILL_API)
const SENDER_EMAIL = 'hello@maecen.net'
const SENDER_NAME = 'Maecen'

function sendEmail (receiver, subject, message) {
  return new Promise((resolve, reject) => {
    mandrillClient.messages.send({
      message: {
        'html': message,
        subject,
        'from_email': SENDER_EMAIL,
        'from_name': SENDER_NAME,
        'to': [{
          email: receiver
        }]
      },
      async: false
    }, resolve, reject)
  })
}

export function emailSupportReceipt (knex, transactionId) {
  return transactionService.fetchReceiptInfoFromTransaction(
    knex, transactionId)
  .then((info) => {
    const {
      firstName,
      email,
      language: lng,
      maecenateTitle,
      maecenateSlug,
      end,
      amount,
      currency,
      orderId
    } = info
    const language = lng || 'en'

    return new Promise((resolve, reject) => {
      i18n.loadLanguages(language, (err) => {
        if (err) return reject(err)
        const nextDonation = moment(end)
          .locale(language)
          .subtract(1, 'days')
          .format('dddd, Do MMMM, YYYY')

        const message = i18n.t('supportReceipt', {
          ns: 'email',
          lng: language,
          firstName,
          fixedAmount: (amount / 100).toFixed(2),
          currency,
          maecenateUrl: `${host}/maecenate/${maecenateSlug}`,
          maecenateTitle,
          nextDonation,
          orderId
        })

        const subject = i18n.t('supportReceiptSubject', {
          ns: 'email',
          lng: language
        })

        return sendEmail(email, subject, message)
        .then(resolve).catch(reject)
      })
    })
  })
}
