export interface CliContext {
  argv: string[]
  config: {
    cos: {
      secret_id: string
      secret_key: string
      buckets: {
        [key: string]: {
          name: string
          region: string
        }
      }
    }
  }
  authConfig: {
    token: string
  }
}