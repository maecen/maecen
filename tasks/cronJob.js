import * as subscriptionService from '../server/services/subscriptions'
import { knex } from '../server/database'

subscriptionService.refreshExpiringSubscriptions(knex)
.then(() => {
  console.log('finished')
  process.exit()
})
.catch((error) => {
  console.error(error)
  process.exit(1)
})
