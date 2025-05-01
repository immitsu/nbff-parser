import { deepEqual } from 'node:assert'
import { test } from 'node:test'

import { parse, stringify } from '../../index.js'
import { readFile } from '../utils.js'

test('stringify', () => {
  ;['./bookmarks-1.html', './bookmarks-2.html'].forEach(file => {
    const initial = readFile(file)
    const parsed = parse(initial)

    const actual = stringify(parsed)

    deepEqual(actual, initial)
  })
})
