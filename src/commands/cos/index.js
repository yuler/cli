const chalk = require('chalk')

const getArgs = require('../../util/get-args')
const getSubcommand = require('../../util/get-subcommand')

const upload = require('./upload')

const help = () => console.log(chalk`
  {bold cli cos} [options] <command>

  {dim Commands:}

    upload    <files>    Upload files to could object storge

  {dim Options:}

    -h, --help            Output usage information

  {dim Examples:}

  {gray -} Upload files 

    {cyan $ cli cos upload image/*.jpg}

    {gray -} The subcommand {dim \`set\`} is the default and can be skipped.

`)

const COMMAND_CONFIG = {
  default: 'upload',
  upload: ['upload', 'add'],
}

module.exports = async function main(ctx) {
  let argv

  try {
    argv = getArgs(ctx.argv.slice(2), {
    })
  } catch (err) {
    throw err
    return 1
  }

  if (argv['--help']) {
    help()
    return 2
  }

  const { subcommand, args } = getSubcommand(argv._.slice(1), COMMAND_CONFIG)

  switch(subcommand) {
    case 'upload':
      return upload(ctx, argv, args)
    default: 
      console.log('default')
  }
}