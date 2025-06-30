import fs from 'node:fs/promises'

import { merge as _merge, parse, stringify } from '../index.js'

const isHtmlFilePath = filePath => filePath.toLowerCase().endsWith('.html')

const validateFilePath = filePath => {
  if (!isHtmlFilePath(filePath)) {
    throw new Error(`File "${filePath}" must have a .html extension`)
  }
}

const validateFilePaths = filePaths => filePaths.forEach(validateFilePath)

export const exclude = async (filePath, attrs, newFilePath) => {
  try {
    validateFilePath(filePath)
    const read = await fs.readFile(filePath, 'utf8')
    const parsed = parse(read, { excludeAttrs: attrs })
    const stringified = stringify(parsed)
    newFilePath ??= filePath
    await fs.writeFile(newFilePath, stringified, 'utf8')
    return `Attributes excluded and file saved as ${newFilePath}`
  } catch (error) {
    return `Error during excluding: ${error.message}`
  }
}

export const merge = async (files, output) => {
  try {
    const filePaths = files.split(',').map(path => path.trim())
    validateFilePaths(filePaths)
    const read = filePaths.map(path => fs.readFile(path, 'utf8'))
    const contents = await Promise.all(read)
    const merged = _merge(...contents)
    !isHtmlFilePath(output) && (output += '.html')
    await fs.writeFile(output, merged, 'utf8')
    return `Files merged successfully into ${output}`
  } catch (error) {
    return `Error during merge: ${error.message}`
  }
}
