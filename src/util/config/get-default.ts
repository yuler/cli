export const getDefaultConfig = async (existingCopy: object) => {
  let migrated = false

  const config: {
    _: string
    [key: string]: any
  } = {
    _: 'This is 🐟 cli config file. For more information set: https://github.com/yuler/cli',
    cos: {
      // secret_id:
      // secret_key:
      buckets: {
        nicetuan: {
          name: 'nicetuan-1257181975',
          region: 'ap-shanghai'
        },
        'nicetuan-test': {
          name: 'nicetuan-test-1257181975',
          region: 'ap-shanghai'
        }
      }
    }
  }

  if (existingCopy) {
    const keep = [
      '_',
      'cos'
    ]

    try {
      const existing = Object.assign({}, existingCopy)
      Object.assign(config, existing)

      for (const key in Object.keys(config)) {
        if (!keep.includes(key)) {
          delete config[key]
        }
      }

      migrated = true;
    } catch (err) {}
  }

  return {
    config,
    migrated
  }
}

export const getDefaultAuthConfig = async (existing: { token: string }) => {
  let migrated = false
  const config: {
    _: string
    token?: string
  } = {
    _: 'This is 🐟 cli credentials file. DO NOT SHARE!'
  }

  if (existing) {
    try {
      config.token = existing.token
      migrated = true
    } catch (err) {}
  }

  return {
    config,
    migrated
  }
}