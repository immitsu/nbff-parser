import pkg from '../package.json' with { type: 'json' }

export const HELP = `
nbff-parser – a simple parser for the Netscape Bookmark File Format (NBFF)

Usage:
  nbff-parser <command> [options]

Commands:
  exclude    Exclude attributes from a bookmark file and write to a new file
  merge      Merge multiple bookmark files into one

Options:
  --help, -h     Show this help message
  --version, -v  Show version number

Examples:
  # Exclude attributes and write to a new file
  npx nbff-parser exclude file=bookmarks.html attrs=add_date,icon output=cleaned.html

  # Exclude attributes and overwrite the original file
  npx nbff-parser exclude file=bookmarks.html attrs=add_date,icon

  # Merge files
  npx nbff-parser merge files=foo.html,bar.html output=merged.html

For more information, visit ${pkg.repository.url}
`

export const VERSION = `v${pkg.version}`

export const EXCLUDE = `
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

export const MERGE = `
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
