import { exclude, merge } from './cmds.js'

const EXCLUDE_CMD_DESCRIPTION = `
Usage: nbff-parser exclude file=path/to/file attrs=attr1,attr2,... [output=path/to/output]

Arguments:
  file=path/to/file           (required) Path to the input HTML file
  attrs=attr1,attr2,...       (required) Comma-separated list of attributes to exclude
  output=path/to/output       (optional) Path to save the output file; defaults to input file

Description:
  Removes specified attributes from the HTML file.
  If 'output' is not provided, the changes will overwrite the original file.

Example:
  nbff-parser exclude file=index.html attrs=add_date,icon output=cleaned.html
`

const MERGE_CMD_DESCRIPTION = `
Usage: nbff-parser merge files=path/to/file,... output=path/to/output

Arguments:
  files=path/to/file,...      (required) Comma-separated list of input file paths to merge
  output=path/to/output       (required) Path to save the merged output file

Description:
  Merges multiple files specified in the 'files' argument into a single output file.
  Both 'files' and 'output' arguments are mandatory.

Example:
  nbff-parser merge files=foo.html,bar.html output=merged.html
`

export const main = async (args, cmds = { exclude, merge }) => {
  const [command, ...params] = args

  const parsedParams = params.reduce((acc, arg) => {
    const [k, v] = arg.split('=')
    v && (acc[k.trim()] = v.trim().replace(/^["']|["']$/g, ''))
    return acc
  }, {})

  switch (command) {
    case 'exclude': {
      const { attrs, file, output } = parsedParams
      if (!file || !attrs) throw new Error(EXCLUDE_CMD_DESCRIPTION)
      const message = await cmds.exclude(file, attrs, output)
      return message
    }
    case 'merge': {
      const { files, output } = parsedParams
      if (!files || !output) throw new Error(MERGE_CMD_DESCRIPTION)
      const message = await cmds.merge(files, output)
      return message
    }
    default:
      throw new Error(`Unknown command: ${command}`)
  }
}
