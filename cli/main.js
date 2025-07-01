import { exclude, merge } from './commands.js'
import { EXCLUDE, HELP, MERGE, VERSION } from './messages.js'

const createSuccessMessage = message => {
  return `✅ ${message.trim()}`
}
const throwErrorMessage = error => {
  const message = error instanceof Error ? error.message : error
  throw new Error(`❌ ${message.trim()}`)
}

const splitCommaSeparatedStr = str =>
  str
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

export const main = async (args, cmds = { exclude, merge }) => {
  const [command, ...rawParams] = args

  const params = rawParams.reduce((acc, arg) => {
    const [k, v] = arg.split('=').map(p => p.trim())
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
      if (!file || !attrs) {
        throwErrorMessage(EXCLUDE)
      }
      return cmds
        .exclude(file, splitCommaSeparatedStr(attrs), output)
        .then(createSuccessMessage)
        .catch(throwErrorMessage)
    }

    case 'merge': {
      const { files, output } = params
      if (!files || !output) {
        throwErrorMessage(MERGE)
      }
      return cmds
        .merge(splitCommaSeparatedStr(files), output)
        .then(createSuccessMessage)
        .catch(throwErrorMessage)
    }

    default: {
      throwErrorMessage(`Unknown command: ${command}`)
    }
  }
}
