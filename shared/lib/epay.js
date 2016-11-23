import axios from 'axios'

const paymentTypes = {
  DANKORT: 1,
  VISA: 3,
  MASTER_CARD: 4,
  MAESTRO: 7,
  JCB: 6
}

const DANKORT_FEES = [70, 110, 139]

const LOCAL_CARD_FEE = 1.50 / 100 // pct in decimal
const FOREIGN_CARD_FEE = 2.95 / 100 // pct in decimal
const JCB_FEE = 3.75 / 100 // pct in decimal

const FOREIGN_CARD_MIN = 195 // danish øre

export const calculateFee = (cardIssuer, amount) => {
  const type = cardIssuer.substr(0, 1)
  const paymentType = Number(cardIssuer.substr(1))

  if (type === 'F') {
    let fee = 0
    if (paymentType === paymentTypes.JCB) {
      fee = feeFromPct(amount, JCB_FEE)
    } else {
      fee = feeFromPct(amount, FOREIGN_CARD_FEE)
    }

    if (fee < FOREIGN_CARD_MIN) return FOREIGN_CARD_MIN
    return fee
  } else if (type === 'L') {
    if (paymentType === paymentTypes.DANKORT) {
      if (amount > 50000) {
        return DANKORT_FEES[2]
      } else if (amount > 5000) {
        return DANKORT_FEES[1]
      } else {
        return DANKORT_FEES[0]
      }
    } else {
      return feeFromPct(amount, LOCAL_CARD_FEE)
    }
  }
  return 0
}

export const getIssuerFromPaymentTypeAndBin = (paymentType, bin) => {
  if (paymentType === paymentTypes.DANKORT) {
    return Promise.resolve('L' + paymentType)
  }

  // Find the countrycode of the the bin
  return axios.get('https://binlist.net/json/' + bin)
  .then(res => res.data)
  .then(data => {
    if (data.country_code !== 'DK' || paymentType === paymentTypes.JCB) {
      return 'F' + paymentType
    } else {
      return 'L' + paymentType
    }
  })
  // If we get an error we assume it's foreign
  .catch(() => 'F' + paymentType)
}

const feeFromPct = (startPrice, pct) => {
  return Math.round(-(startPrice / (pct - 1)) - startPrice)
}

