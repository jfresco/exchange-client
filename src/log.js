const debug = require('debug')

module.exports = function (moduleName) {
  return debug(`exchange:${moduleName}`)
}
