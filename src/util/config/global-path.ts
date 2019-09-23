import { homedir } from 'os'
import path from 'path'

import arg from 'arg'

const homeConfigPath: string = path.join(homedir(),'.yu')

const getCliDir = (): string => {
  const args = arg({
    // Types
    '--global-config': String,
    // Alias
    '-Q': '--global-config'
  }, { permissive: true })

  const customPath = args['--global-config']

  return (
    (customPath && path.resolve(customPath)) ||
    homeConfigPath    
  )
}

export default getCliDir
