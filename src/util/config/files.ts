import { join as joinPath } from 'path'

import loadJSON from 'load-json-file'
import writeJSON from 'write-json-file'

import getCliDir from './global-path'
import highlight from '../output/highlight'

const CLI_DIR = getCliDir()
const CONFIG_FILE_PATH = joinPath(CLI_DIR, 'config.json')
const AUTH_CONFIG_FILE_PATH = joinPath(CLI_DIR, 'auth.json')

export const getConfigFilePath = () => CONFIG_FILE_PATH
export const readConfigFile = () => loadJSON.sync(CONFIG_FILE_PATH)

export const writeToConfigFile = (stuff: object) => {
  try {
    return writeJSON.sync(CONFIG_FILE_PATH, stuff, { indent: 2 })
  } catch(err) {
    if (err.code === 'EPERM') {
      console.error(
        `Not able to create ${highlight(
          CONFIG_FILE_PATH
        )} (operation not permitted).`
      )
      process.exit(1)
    } else if (err.code === 'EBADF') {
      console.error(
        `Not able to create ${highlight(
          CONFIG_FILE_PATH
        )} (bad file descriptor).`
      )
      process.exit(1)
    }

    throw err
  }
}

export const getAuthConfigFilePath = () => AUTH_CONFIG_FILE_PATH
export const readAuthConfigFile = () => loadJSON.sync(AUTH_CONFIG_FILE_PATH)

export const writeToAuthConfigFile = (stuff: object) => {
  try {
    return writeJSON.sync(AUTH_CONFIG_FILE_PATH, stuff, {
      indent: 2,
      mode: 0o600
    })
  } catch(err) {
    if (err.code === 'EPERM') {
      console.error(
        `Not able to create ${highlight(
          AUTH_CONFIG_FILE_PATH
        )} (operation not permitted).`
      )
      process.exit(1)
    } else if (err.code === 'EBADF') {
      console.error(
        `Not able to create ${highlight(
          AUTH_CONFIG_FILE_PATH
        )} (bad file descriptor).`
      )
      process.exit(1)
    }

    throw err
  }
}