import { Mandrill } from 'mandrill-api/mandrill'
import promiseLimit from 'promise-limit'
import moment from 'moment'
import fs from 'fs'
import path from 'path'
import Handlebars from 'handlebars'
import { host } from '../../shared/config'
import * as service from './email'
import * as transactionService from './transactions'
import * as userService from '../services/users'

const mandrillClient = new Mandrill(process.env.MANDRILL_API)
const SENDER_EMAIL = 'hello@maecen.net'
const SENDER_NAME = 'Maecen'

function sendEmail (receiver, subject, message, async) {
  async = async || false
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
      async
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
        maecenateUrl: `${host}/${maecenateSlug}`,
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

export function emailMaecenateDeactivated (knex, data, message) {
  const limit = promiseLimit(10)
  const { maecenate, users } = data

  Promise.all(users.map(user =>
    limit(() =>
      loadTemplate('maecenateDeactivated', user.language)
      .then((template) => {
        const { subject, body } = template({
          maecenate: maecenate.title,
          firstName: user.first_name,
          endDate: moment(user.end).format('LL'),
          message
        })
        console.log(subject, body)

        return sendEmail(user.email, subject, body, true)
      })
    )
  ))
}

export function emailToSupporters (knex, maecenateId, title, message) {
  const limit = promiseLimit(10)

  return service.fetchToMaecenateData(knex, maecenateId)
  .then(({ users, maecenate }) => {
    Promise.all(users.map(user =>
      limit(() =>
        loadTemplate('maecenateToSupporters', user.language)
        .then(template => {
          console.log('maecenate', maecenate)
          const { subject, body } = template({
            maecenateTitle: maecenate.title,
            maecenateUrl: `${host}/${maecenate.slug}`,
            message,
            subject: title
          })

          return sendEmail(user.email, subject, body, true)
        })
      )
    ))
  })
}

// Helper functions
// ================
const cachedTemplates = {}
function loadTemplate (name, language) {
  return new Promise((resolve, reject) => {
    const slug = name + ':' + language
    if (slug in cachedTemplates) {
      return resolve(cachedTemplates[slug])
    }

    const filePath = path.join(
      __dirname,
      '../../locales',
      language || 'en', // Fallback language is english
      'emails',
      `${name}.hbs`
    )
    fs.readFile(filePath, (err, source) => {
      if (err) return reject(err)
      const template = Handlebars.compile(source.toString())
      const fn = (data) => {
        const [subject, body] = template(data).split(/\n==+\n([\s\S]+)?/)
        return { subject, body }
      }
      cachedTemplates[slug] = fn
      resolve(fn)
    })
  })
}
