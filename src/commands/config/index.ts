import chalk from 'chalk'
import logo from '../../util/output/logo'
import getArgs from '../../util/get-args'
import getSubcommand from '../../util/get-subcommand'
import handleError from '../../util/handle-error'
import createOutput from '../../util/output/create-output'

import { CliContext } from '../../types'
import ls from './ls'

const help = () => console.log(chalk`
  {bold ${logo} yu config } [options] <command>

  {dim Commands:}
    
    ls            [key]            List your global config ~/.yu
    set           <key> <value>    Set you global config
    rm            <key>            Rmove you global config by key

  {dim Options:}

    -h, --help                     Output usage information
    -v, --version                  Output the version number

  {dim Examples:}

  {gray –} List the gloabl config

    {cyan $ yu config ls}

  {gray –} Set the gloabl config

    {cyan $ yu config cos.secret_id xxx}

`)

const COMMAND_CONFIG = {
  default: 'set',
  ls: ['ls', 'list'],
  rm: ['rm', 'remove'],
  set: ['set']
}

module.exports = async function main(ctx: CliContext) {
  let argv

  try {
    argv = getArgs(ctx.argv.slice(2))
  } catch (err) {
    handleError(err)
    return 1
  }

  if (argv['--help']) {
    help()
    return 2
  }

  const output = createOutput({ debug: argv['--debug'] })
  const { subcommand, args } = getSubcommand(argv._.slice(1), COMMAND_CONFIG)

  switch(subcommand) {
    case 'ls':
      return ls(ctx, argv, args, output)
    default: 
      console.log('default')
  }
}