#!/usr/bin/env node

import { main } from './main.js'

main(process.argv.slice(2))
  .then(message => `✅ ${message}`)
  .catch(error => {
    console.error(`❌ ${error.message}`)
    process.exit(1)
  })
