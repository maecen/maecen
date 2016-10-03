// Imports
import { isBrowser, isSmallDevice } from '../config'

class EpayWindow {
  constructor () {
    this.onReady = null
  }

  load () {
    if (isBrowser === true) {
      const epayScript = 'https://ssl.ditonlinebetalingssystem.dk' +
        '/integration/ewindow/paymentwindow.js'

      if (typeof window.PaymentWindow === 'undefined') {
        const $script = require('scriptjs')
        $script(epayScript, () => {
          if (typeof this.onReady === 'function') this.onReady()
        })
      } else {
        if (typeof this.onReady === 'function') this.onReady()
      }
    }
  }

  open (options) {
    console.log('open?')
    return new Promise((resolve, reject) => {
      if (isSmallDevice) {
        options = {
          ...options,
          accepturl: `${window.location.href}`
        }
      }

      this.paymentWindow = new window.PaymentWindow(options) // eslint-disable-line no-undef
      this.paymentWindow.on('close', resolve)
      this.paymentWindow.on('declined', reject)
      this.paymentWindow.open()
    })
  }
}

export default EpayWindow
