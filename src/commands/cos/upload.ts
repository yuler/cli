import chalk from 'chalk'
import { CliContext } from '../../types'
import { Output } from '../../util/output'
// @ts-ignore
import COS from 'cos-nodejs-sdk-v5'

export default async function upload(
  ctx: CliContext,
  opts: any,
  args: string[],
  output: Output
) {
  if (!args.length) {
    output.error(
      `Invalid number of arguments. Usage: ${chalk.cyan(
        '`yu cos upload <files>`'
      )}`
    )
    return 1
  }

  const { 
    secret_id,
    secret_key
  } = ctx.config.cos
  
  const bucket = opts['--bucket'] || 'nicetuan'
  const {
    name,
    region
  } = ctx.config.cos.buckets[bucket]

  const cos = new COS({
    SecretId: secret_id,
    SecretKey: secret_key,
  })

  let prefix = opts['--prefix']
  if (prefix) {
    prefix = prefix.replace(/\/$/, '')
  } else {
    const now = new Date()
    const year = now.getFullYear()
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const date = (now.getDate() + 1).toString().padStart(2, '0')
    prefix = `${year}/${month}/${date}`
  }

  args.forEach(file => {
    cos.sliceUploadFile({
      Bucket: name,
      Region: region,
      Key: `${prefix}/${file}`,
      FilePath: file,
      onProgress() {
        // @TODO display process
        // console.log(JSON.stringify(data))
      }
    }, function(
      err: Error,
      data: {
        statusCode: number
        headers: object
        Location: string
        Bucket: string
        Key: string
        ETag: string
        VersionId: string
      }
    ) {
      if (err) throw err
      console.log(`Upload success: https://${data.Location}`)
    })
  })
}