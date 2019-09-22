const { homedir } = require('os')
const path = require('path')

const getCliDir = () => {
  return path.join(homedir(), '.yu')
}

module.exports = getCliDir