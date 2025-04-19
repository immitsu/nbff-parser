import { deepEqual } from 'node:assert'
import { test } from 'node:test'

import { parse, stringify } from '../../index.js'
import { readFileRelative } from '../utils.js'

test('stringify', () => {
  const initial = readFileRelative('./bookmarks-1.html')
  const parsed = parse(initial)

  const actual = stringify(parsed[0])

  deepEqual(actual, initial)
})
