const KrakenClient = require('kraken-api')
const utils = require('./utils')
const config = require('../config')

const fetchFromCache = utils.fetchFromCache('kraken')
const saveToCache = utils.saveToCache('kraken')

function fetchFromRemote () {
  const { apiKey, secret } = config.providers.kraken
  const kraken = new KrakenClient(apiKey, secret)
  return kraken.api('Depth', { pair: 'ETHXBT' })
}

module.exports = utils.fetch({
  fetchFromCache,
  saveToCache,
  fetchFromRemote
})
