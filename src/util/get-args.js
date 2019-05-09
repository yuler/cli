const arg = require('arg')
const getCommonArgs = require('./arg-common')

module.exports = function getArgs(argv, argsOptions, argOptions) {
  return arg(Object.assign({}, getCommonArgs(), argsOptions), {
    ...argOptions,
    argv
  })
}