const log = require('./log')('main')
const getFromKraken = require('./clients/kraken-client')
const getFromBitfinex = require('./clients/bitfinex-client')
const { OrderBook } = require('./model')
const { Trade } = require('./model')

// Main entry point
;(async function () {
  try {
    log('Fetching data...')
    const [krakenData, bitfinexData] = await Promise.all([
      getFromKraken(),
      getFromBitfinex()
    ])
    log('Data fetched.')

    const trade = Trade({
      kraken: OrderBook.fromKraken(krakenData['result']['XETHXXBT']),
      bitfinex: OrderBook.fromBitfinex(bitfinexData)
    })

    const myOrders = trade.sellByAmount(10) // sell enough ETH to get 10 BTC

    const ethToSell = myOrders.reduce((accum, x) => accum + x.volume, 0)
    const btcBuyed = myOrders.reduce((accum, x) => accum + x.price * x.volume, 0)

    console.log('My orders', JSON.stringify(myOrders, null, 2))
    console.log('You\'ll need to sell', ethToSell, 'ETH to buy', btcBuyed, 'BTC')

    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}())
