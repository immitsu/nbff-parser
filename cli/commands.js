import fs from 'node:fs/promises'

import { merge as _merge, parse, stringify } from '../index.js'

const isHtmlFilePath = filePath => filePath.toLowerCase().endsWith('.html')

const validateFilePath = filePath => {
  if (!isHtmlFilePath(filePath)) {
    throw new Error(`File "${filePath}" must have a .html extension`)
  }
}

const validateFilePaths = filePaths => filePaths.forEach(validateFilePath)

export const exclude = async (filePath, attrs, outputPath) => {
  validateFilePath(filePath)
  const read = await fs.readFile(filePath, 'utf8')
  const parsed = parse(read, { excludeAttrs: attrs })
  const stringified = stringify(parsed)
  outputPath ??= filePath
  await fs.writeFile(outputPath, stringified, 'utf8')
  return `Attributes excluded and file saved as ${outputPath}`
}

export const merge = async (filePaths, outputPath) => {
  validateFilePaths(filePaths)
  const read = filePaths.map(path => fs.readFile(path, 'utf8'))
  const contents = await Promise.all(read)
  const merged = _merge(...contents)
  !isHtmlFilePath(outputPath) && (outputPath += '.html')
  await fs.writeFile(outputPath, merged, 'utf8')
  return `Files merged successfully into ${outputPath}`
}
