#!/usr/bin/env node

import { main } from './main.js'

main(process.argv.slice(2))
  .then(console.log)
  .catch(error => {
    console.error(error.message)
    process.exit(1)
  })
