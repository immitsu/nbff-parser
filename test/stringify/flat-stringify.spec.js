import { deepEqual, throws } from 'node:assert'
import { describe, test } from 'node:test'

import { flatParse, flatStringify } from '../../index.js'
import { readFileRelative } from '../utils.js'

describe('flat-stringify', () => {
  const initial = readFileRelative('./bookmarks-2.html')

  test('default', () => {
    const parsed = flatParse(initial, { withId: true })
    const actual = flatStringify(parsed)

    deepEqual(actual, initial)
  })

  test('disable `withId` option', () => {
    throws(() => {
      const parsed = flatParse(initial)
      flatStringify(parsed)
    }, /^error: root folder with id not found.$/i)
  })
})
