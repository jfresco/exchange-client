const fs = require('fs')
const path = require('path')
const util = require('util')
const { map, filter, last, sortBy } = require('lodash/fp')
const log = require('../log')('clients')

const DATA_DIRECTORY = './data'

const writeFile = util.promisify(fs.writeFile)
const readFile = util.promisify(fs.readFile)
const readDir = util.promisify(fs.readdir)

const onlyWithDate = ({ date }) => !!date

const putDate = serviceName => filename => {
  const re = RegExp(`${serviceName}-([0-9]+).json`)
  const match = filename.match(re)
  const date = match && new Date(+match[1])
  return { filename, date }
}

const expired = ({ date }) => {
  const now = +new Date()
  return now - date > 120000
}

module.exports.fetchFromCache = function fetchFromCache (key) {
  return async function fetch () {
    log(`[${key}]`, 'Attempting to fetch from cache...')
    const files = await readDir(DATA_DIRECTORY)
    const file = last(sortBy('date')(filter(onlyWithDate)(map(putDate(key))(files))))
    if (file && !expired(file)) {
      log(`[${key}]`, 'Cache hit. File:', file.filename)
      const buffer = await readFile(path.join(DATA_DIRECTORY, file.filename))
      return JSON.parse(buffer.toString())
    }
  }
}

module.exports.saveToCache = function saveToCache (key) {
  return function save (payload) {
    const filename = `${key}-${+new Date()}.json`
    log(`[${key}]`, 'Saving to cache file', filename)
    const serializedPayload = JSON.stringify(payload, null, 2)

    return writeFile(path.join(DATA_DIRECTORY, filename), serializedPayload)
  }
}

module.exports.fetch = function ({ saveToCache, fetchFromCache, fetchFromRemote }) {
  return async function () {
    let content = await fetchFromCache()
    if (!content) {
      content = await fetchFromRemote()
      await saveToCache(content)
    }

    return content
  }
}
