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

  args.forEach(file => {
    cos.sliceUploadFile({
      Bucket: COS_BUCKET,
      Region: COS_REGION,
      Key: `${file.replace(/^cdn/, 'weapp')}`,
      FilePath: file,
      onProgress(data) {
        console.log(JSON.stringify(data));
      }
    }, function(err, data) {
      if (err) throw err
      console.log(data)
      console.log(`${data.Key}`)
    })
  })

}