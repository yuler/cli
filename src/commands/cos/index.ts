import chalk from 'chalk'

import getArgs from '../../util/get-args'
import getSubcommand from '../../util/get-subcommand'
import handleError from '../../util/handle-error'
import logo from '../../util/output/logo'
import { CliContext } from '../../types'
import upload from './upload'
import createOutput from '../../util/output/create-output'

const help = () => console.log(chalk`
  {bold ${logo} yu cos} [options] <command>

  {dim Commands:}

    upload    <files>    Upload files to could object storge

  {dim Options:}

    -h, --help                      Output usage information
    -p DIR, --prefix=DIR            Upload cos path prefix, default: \`year/month/date\` 
    -b name, --bucket=name          Upload cos bucket name, \`nicetuan\` or \`nicetuan-test\`, default: \`nicetuan\` 

  {dim Examples:}

  {gray -} Upload files 

    {cyan $ yu cos upload image/*.jpg}

`)

const COMMAND_CONFIG = {
  upload: ['upload', 'add'],
}

module.exports = async function main(ctx: CliContext) {
  let argv

  try {
    argv = getArgs(ctx.argv.slice(2), {
      '--prefix': String,
      '-p': '--prefix',
      '--bucket': String,
      '-b': '--bucket'
    }, { permissive: true })
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
    case 'upload':
      return upload(ctx, argv, args, output)
    default: 
      console.log('default')
  }
}