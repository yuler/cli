const { homedir } = require('os')
const path = require('path')

const getCliDir = () => {
  return path.join(homedir(), '.cli')
}

module.exports = getCliDir