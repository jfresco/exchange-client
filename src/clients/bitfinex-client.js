const BFX = require('bitfinex-api-node')
const utils = require('./utils')
const config = require('../config')

const fetchFromCache = utils.fetchFromCache('bitfinex')
const saveToCache = utils.saveToCache('bitfinex')

function fetchFromRemote () {
  const { apiKey, secret } = config.providers.bitfinex
  const bitfinex = new BFX({ apiKey, apiSecret: secret, version: 1 }).rest
  return new Promise(function (resolve, reject) {
    bitfinex.orderbook('ETHBTC', function (err, res) {
      if (err) {
        return reject(err)
      }

      resolve(res)
    })
  })
}

module.exports = utils.fetch({
  fetchFromCache,
  saveToCache,
  fetchFromRemote
})
