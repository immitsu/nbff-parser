import { exclude, merge } from './commands.js'
import { EXCLUDE, HELP, MERGE, VERSION } from './messages.js'

const printSuccess = message => {
  return `✅ ${message.trim()}`
}

const throwError = error => {
  const message = error instanceof Error ? error.message : error
  throw new Error(`❌ ${message.trim()}`)
}

const splitStrBySeparator = (str, separator = ',') =>
  str
    .split(separator)
    .map(s => s.trim())
    .filter(Boolean)

export const main = async (args, cmds = { exclude, merge }) => {
  const [command, ...restArgs] = args

  const params = restArgs.reduce((acc, arg) => {
    const [k, v] = splitStrBySeparator(arg, '=')
    v && (acc[k] = v.replace(/^["']|["']$/g, ''))
    return acc
  }, {})

  switch (command) {
    case '--help':
    case '-h':
      return HELP

    case '--version':
    case '-v':
      return VERSION

    case 'exclude': {
      const { attrs, file, output } = params
      if (!attrs || !file || !attrs) {
        throwError(EXCLUDE)
      }
      return cmds
        .exclude(file, splitStrBySeparator(attrs), output)
        .then(printSuccess)
        .catch(throwError)
    }

    case 'merge': {
      const { files, output } = params
      if (!files || !output) {
        throwError(MERGE)
      }
      return cmds
        .merge(splitStrBySeparator(files), output)
        .then(printSuccess)
        .catch(throwError)
    }

    default: {
      throwError(`Unknown command: ${command}`)
    }
  }
}
