const path = require('path')
const exists = require('fs').existsSync

const CONFIG_FILE = './config.json'
const filename = path.resolve(CONFIG_FILE)

if (!exists(filename)) {
  throw new Error(`Can't find ${filename}. Make sure it is created. You can do it by copying the example file, like this: 'cp config.json.example config.json'.`)
}

module.exports = require(filename)
