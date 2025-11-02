import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const readFile = filePath => {
  const file = resolve(__dirname, filePath)
  return readFileSync(file, 'utf8')
}
