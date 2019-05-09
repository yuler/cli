const fs = require('fs')
const { join: joinPath } = require('path')
const getNowDir = require('./global-path')

const CLI_DIR = getNowDir()
const CONFIG_FILE_PATH = joinPath(CLI_DIR, 'config.json')

exports.readConfigFile = () => require(CONFIG_FILE_PATH)

exports.writeToConfigFile = stuff => {
  fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(stuff, null, 2))
}

exports.getConfigFilePath = () => {
  return CONFIG_FILE_PATH
}

