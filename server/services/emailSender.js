import { Mandrill } from 'mandrill-api/mandrill'
import moment from 'moment'
import { host } from '../../shared/config'
import * as transactionService from './transactions'

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
      maecenateTitle,
      maecenateSlug,
      end,
      amount,
      currency,
      orderId
    } = info
    const fixedAmount = (amount / 100).toFixed(2)

    const nextDonation = moment(end)
      .subtract(1, 'days')
      .format('dddd Do of MMMM, YYYY')

    const message = `
      Thank you ${firstName}!
      <br /><br />
      You have just completed a donation of
      <strong>${fixedAmount} ${currency}</strong>
      to the maecenate
      <a href="${host}/maecenate/${maecenateSlug}">
        ${maecenateTitle}
      </a>.
      <br /><br />
      We will bill you next time on the ${nextDonation}, if you want to cancel,
      you have to do it the latest the day before.
      <br /><br />
      We are ever grateful for your support! <br />
      The Maecen Team <br />
      <small>
        Maecen.net/DiGiDi ­ Digital Distribution a..m.b.a. <br />
        Hallelevvej 15, 4200 Slagelse. <br />
        Order Nr.: ${orderId}
      </small>
    `

    const subject = 'Thanks for your support!'
    return sendEmail(email, subject, message)
  })
}
