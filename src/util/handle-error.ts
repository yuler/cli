import errorOutput from './output/error'

export default function handleError(
  error: string | Error,
  { debug = false } = {}
) {
  if (typeof error === 'string') {
    error = new Error(error)
  }

  if (debug) {
    console.log(`> [debug] handling error: ${error.stack}`)
  }

  console.error(
    errorOutput(
      `Unexpected error. Please try again later. (${error.message})`
    )
  );
}