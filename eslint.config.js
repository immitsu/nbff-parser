import js from '@eslint/js'
import perfectionist from 'eslint-plugin-perfectionist'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  js.configs.recommended,
  perfectionist.configs['recommended-natural'],

  {
    files: ['./cli/**/*.js', './test/cli/**/*.js'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly'
      }
    }
  }
])
