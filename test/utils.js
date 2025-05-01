import { readFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

export const readFile = relativePath => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const filePath = resolve(__dirname, relativePath)
  return readFileSync(filePath, 'utf8')
}
