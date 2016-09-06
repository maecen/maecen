import { Mandrill } from 'mandrill-api/mandrill'
import moment from 'moment'
import fs from 'fs'
import path from 'path'
import Handlebars from 'handlebars'
import { host } from '../../shared/config'
import * as transactionService from './transactions'
import * as userService from '../services/users'

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

    return loadTemplate('receiptSupport', language)
    .then((template) => {
      const nextDonation = moment(end)
        .locale(language)
        .subtract(1, 'days')
        .format('dddd, Do MMMM, YYYY')

      const { subject, body } = template({
        firstName,
        fixedAmount: (amount / 100).toFixed(2),
        currency,
        maecenateUrl: `${host}/maecenate/${maecenateSlug}`,
        maecenateTitle,
        nextDonation,
        orderId
      })

      return sendEmail(email, subject, body)
    })
  })
}

export function emailForgotPassword (knex, token, userId) {
  return userService.fetchUser(knex, userId)
  .then(({ email, firstName, language }) => {
    return loadTemplate('passwordLost', language)
    .then((template) => {
      const { subject, body } = template({
        firstName: firstName,
        authTokenUrl: `${host}/authToken/?token=${token}`
      })
      return sendEmail(email, subject, body)
    })
  })
}

// Helper functions
// ================

function loadTemplate (email, language) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(
      __dirname,
      '../../locales',
      language || 'en', // Fallback language is english
      'emails',
      `${email}.hbs`
    )
    fs.readFile(filePath, (err, source) => {
      if (err) return reject(err)
      const template = Handlebars.compile(source.toString())
      resolve((data) => {
        const [subject, body] = template(data).split(/\n==+\n([\s\S]+)?/)
        return { subject, body }
      })
    })
  })
}
