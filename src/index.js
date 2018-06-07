const log = require('./log')('main')
const getFromKraken = require('./clients/kraken-client')
const getFromBitfinex = require('./clients/bitfinex-client')
const { OrderBook } = require('./model')

// Main entry point
;(async function () {
  try {
    const [krakenData, bitfinexData] = await Promise.all([
      getFromKraken(),
      getFromBitfinex()
    ])

    const orderBooks = {
      kraken: OrderBook.fromKraken(krakenData['result']['XETHXXBT']),
      bitfinex: OrderBook.fromBitfinex(bitfinexData)
    }

    log('Order books', orderBooks)

    process.exit(0)
  } catch (err) {
    log(err)
    process.exit(1)
  }
}())
