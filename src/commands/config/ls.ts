import { CliContext } from '../../types'
import { Output } from '../../util/output'
import { readConfigFile } from '../../util/config/files'
import table from 'text-table'
import strlen from '../../util/strlen'
import chalk from 'chalk'

interface ConfigItem {
  key: string
  value: string | undefined
}

export default async function upload(
  ctx: CliContext,
  opts: any,
  args: string[],
  output: Output
) {
  if (!args.length) {
    const data = readConfigFile() as object
    const keys: string[] = []
    getAllKeys(data, '', keys)
    const items = keys.map(key => {
      return { key, value: getValue(data, key) }
    })

    output.log(
      `${items.length} keys found under config`
    )
    console.log(printTable(items))

    return 0
  }

  function getAllKeys(obj: { [key: string]: any }, prefix: string, keys: string[]) {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] !== 'object') {
        keys.push([prefix, key].join('.').substring(1))
      } else {
        getAllKeys(obj[key], [prefix, key].join('.'), keys)
      }
    })
  }

  function getValue(obj: { [key: string]: any }, key: string): any {
    const keys = key.split('.')
    for (let i = 0; i < keys.length; i++) {
      if (!obj[keys[i]]) return
      obj = obj[keys[i]]
    }
    return obj 
  }


  function printTable(items: ConfigItem[]) {
    return `${table(
      [
        ['key', 'value'].map(h => chalk.gray(h)),
        ...items.map(item => [
          item.key,
          item.value || 'null'
        ])
      ],
      {
        align: ['l', 'l'],
        hsep: ' '.repeat(4),
        stringLength: strlen
      }
    ).replace(/^/gm, '  ')}\n\n`
  }
}