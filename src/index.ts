#!/usr/bin/env ts-node
import chalk from 'chalk'
import getArgs from './util/get-args'
import hp from './util/humanize-path'
import * as configFiles from './util/config/files'
import getCliDir from './util/config/global-path'
import createOutput from './util/output/create-output'
import param from './util/output/param'
import error from './util/output/error'
import logo from './util/output/logo'
import handlerError from './util/handle-error'
import pkg from '../package.json'
import { existsSync } from 'fs'
import { getDefaultConfig } from './util/config/get-default'
import commands from './commands'
import { mkdirp } from 'fs-extra'

const CLI_DIR = getCliDir()
const CLI_CONFIG_PATH: any = configFiles.getConfigFilePath
const CLI_AUT_CONFIG_PATH: any = configFiles.getAuthConfigFilePath

const GLOBAL_COMMANDS = new Set(['help'])

let debug: any = () => {}

const help = () => console.log(chalk`
  {bold ${logo} yu} [options] <command>

  {dim Commands:}
    
    config            [name] [value]          Manages your global config ~/.yu
    cos               [cmd]                   Tencent COS imple operation
    help              [cmd]                   Displays complete help for [cmd]

  {dim Options:}

    -h, --help                     Output usage information
    -v, --version                  Output the version number

  {dim Examples:}

  {gray -} List the gloabl config

    {cyan $ yu config ls}

  {gray -} Cos upload

    {cyan $ yu cos upload image/*.png}

`)

const main = async (argv_: string[]) => {
  const { isTTY } = process.stdout

  let argv = null
  
  try {
    argv = getArgs(
      argv_,
      {
        '--version': Boolean,
        '-v': '--version'
      },
      { permissive: true }
    )
  } catch (err) {
    handlerError(err)
    return 1
  }

  const isDebugging = argv['--debug']
  const output = createOutput({ debug: isDebugging })

  debug = output.debug
  
  let subcommand = argv._[2]

  debug(`Using 🐟 CLI ${pkg.version}`)

  if (!subcommand) {
    if (argv['--version']) {
      console.log(pkg.version)
      return 0
    }
  }

  let cliDirExists: boolean
  try {
    cliDirExists = existsSync(CLI_DIR)
  } catch (err) {
    console.error(
      error(
        `${'An unexpected error occurred while trying to find the ' +
          'cli global directory: '}${err.message}`
      )
    )
    return 1
  }

  if (!cliDirExists) {
    try {
      await mkdirp(CLI_DIR)
    } catch (err) {
      console.error(
        error(
          `${'An unexpected error occurred while trying to create the ' +
            `cli global directory "${hp(CLI_DIR)}" `}${err.message}`
        )
      )
    }
  }

  let migrated = false
  let configExists: boolean

  try {
    configExists = existsSync(CLI_CONFIG_PATH)
  } catch (err) {
    console.error(
      error(
        `${'An unexpected error occurred while trying to find the ' +
          `cli config file "${hp(CLI_CONFIG_PATH)}" `}${err.message}`
      )
    )
    return 1
  }

  let config: any
  if (configExists) {
    try {
      config = configFiles.readConfigFile()
    } catch (err) {
      console.error(
        error(
          `${'An unexpected error occurred while trying to read the ' +
            `ci config in "${hp(CLI_CONFIG_PATH)}" `}${err.message}`
        )
      )
      return 1
    }
  }

  if (!configExists) {
    const results = await getDefaultConfig(config)
    
    config = results.config
    migrated = results.migrated

    try {
      configFiles.writeToConfigFile(config)
    } catch (err) {
      console.error(
        error(
          `${'An unexpected error occurred while trying to write the ' +
            `default cli config to "${hp(CLI_CONFIG_PATH)}" `}${err.message}`
        )
      )
      return 1
    }
  }

  if (migrated) {
    const directory = param(hp(CLI_DIR))
    debug(
      `The credentials and configuration within the ${directory} directory were upgraded`
    )
  }

  // the context object supply to the providers or the commands
  const ctx = {
    config,
    argv: argv_
  }

  if (
    (argv['--help'] && !subcommand) ||
    (subcommand === 'help' && !argv_[3])
  ) {
    help()
    return 0
  }

  if (subcommand === 'help') {
    subcommand = argv._[3]
    ctx.argv.push('-h')
  }

  const targetCommand = commands.get(subcommand)

  if (!targetCommand) {
    const sub = param(subcommand)
    console.error(error(`The ${sub} subcommand does not exist`))
    return 1
  }

  let exitCode: number
  try {
    const start = Date.now()
    const full = require(`./commands/${targetCommand}`)
    exitCode = await full(ctx)
    const end = Date.now() - start
    debug(
      `${targetCommand} execution time: ${end}`
    )
  } catch (err) {
    output.error(`An unexpected error occurred in ${subcommand}: ${err.stack}`);
    return 1
  }

  return exitCode
}

debug('start')

main(process.argv)
  
