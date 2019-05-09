const chalk = require('chalk')

const COS = require('cos-nodejs-sdk-v5')

const configFiles = require('../../util/config/files')

module.exports = async function upload(ctx, argv, args) {
  if (!args.length) {
    return console.log(
      chalk`{gray \`}{cyan cli cos upload <files>}{gray \`} numst need <files>`
    )
  }

  const { 
    COS_SECRET_ID, 
    COS_SECRET_KEY,
    COS_BUCKET,
    COS_REGION
  } = ctx.config

  if ([COS_SECRET_ID, COS_SECRET_KEY, COS_BUCKET, COS_REGION].some(val => !val)) {
    return console.log(
      chalk`{gray \`}{cyan cli cos upload <files>}{gray \`} need set COS_SECRET_ID, COS_SECRET_KEY, COS_BUCKET, COS_REGION in ${configFiles.getConfigFilePath()}`
    )
  }

  const cos = new COS({
    SecretId: COS_SECRET_ID,
    SecretKey: COS_SECRET_KEY,
  })

  let prefix = argv['--prefix']
  if (prefix) {
    prefix = prefix.replace(/\/$/, '')
  }
  else {
    const now = new Date()
    const year = now.getFullYear()
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const date = (now.getDate() + 1).toString().padStart(2, '0')
    prefix = `${year}/${month}/${date}`
  }

  args.forEach(file => {
    cos.sliceUploadFile({
      Bucket: COS_BUCKET,
      Region: COS_REGION,
      Key: `${prefix}/${file}`,
      FilePath: file,
      onProgress(data) {
        // @TODO display process
        // console.log(JSON.stringify(data))
      }
    }, function(err, data) {
      if (err) throw err
      console.log(`Upload success: https://${data.Location}`)
    })
  })

}