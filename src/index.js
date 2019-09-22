const fs = require('fs')

const chalk = require('chalk')

const commands = require('./commands')
const getArgs = require('./util/get-args')
const getCliDir = require('./util/config/global-path')
const configFiles = require('./util/config/files')

const CLI_DIR = getCliDir()
const CLI_CONFIG_PATH = configFiles.getConfigFilePath()

const help = () => chalk`
  {bold CLI} [options] <command>

  {dim Commands:}

    cos                  [cmd]       Tencent COS imple operation
    help                 [cmd]       Displays complete help for [cmd]

  {dim Options:}
    -h, --help                     Output usage information
    -v, --version                  Output the version number
`

const main = async argv_ => {
  let argv = null
  try {
    argv = getArgs(
      argv_,
      {
        '--version': Boolean,
        '-v': '--version',
      },
      { permissive: true }
    )
  } catch(err) {
    throw err
  }

  const isDebugging = argv['--debug']

  const subcommand = argv._[2]

  if (!subcommand) {
    if (argv['--version']) {
      console.log(require('../package').version)
      return 0
    }
    if (argv['--help']) {
      console.log(help())
      return 0
    }
    console.log(help())
    return 0
  }
  
  if (!commands[subcommand]) {
    console.error(chalk`The {gray "}{bold ${subcommand}}{gray "} subcommand does not exist`)
    return 1
  }

  let cliDirExists
  try {
    cliDirExists = fs.existsSync(CLI_DIR)
  } catch (err) {
    throw err
  }

  if (!cliDirExists) {
    try {
      await fs.promises.mkdir(CLI_DIR)
    } catch (err) {
      throw err
    }
  }

  let configExists
  try {
    configExists = fs.existsSync(CLI_CONFIG_PATH)
  } catch (err) {
    throw err
  }

  if (!configExists) {
    try {
      configFiles.writeToConfigFile({
        _: 'This is your cli config file.'
      })
    } catch (err) {
      throw err
    }
  }

  let config
  try {
    config = configFiles.readConfigFile()
  } catch (err) {
    throw err
  }

  const ctx = {
    config,
    argv: argv_
  }

  if (subcommand) {
    const full = require(`./commands/${subcommand}`)
    exitCode = await full(ctx)
  }
}

main(process.argv)