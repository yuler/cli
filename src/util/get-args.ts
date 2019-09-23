import arg from 'arg'
import getCommonArgs from './arg-common'

export default function getArgs<T extends arg.Spec> (
  argv: string[],
  argsOptions?: T,
  argOptions?: arg.Options
) {
  return arg(Object.assign({}, getCommonArgs(), argsOptions), {
    ...argOptions,
    argv
  })
}
