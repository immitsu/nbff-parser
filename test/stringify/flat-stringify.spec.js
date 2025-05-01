import { deepEqual, throws } from 'node:assert'
import { describe, test } from 'node:test'

import { flatParse, flatStringify } from '../../index.js'
import { readFile } from '../utils.js'

describe('flat-stringify', () => {
  const initial = readFile('./bookmarks-2.html')

  test('default', () => {
    const parsed = flatParse(initial, { withId: true })
    const actual = flatStringify(parsed)

    deepEqual(actual, initial)
  })

  test('disable `withId` option', () => {
    throws(() => {
      const parsed = flatParse(initial)
      flatStringify(parsed)
    }, /^error: root folder requires an identifier$/i)
  })
})
