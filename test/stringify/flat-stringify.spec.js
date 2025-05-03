import { equal, ok, throws } from 'node:assert'
import { describe, test } from 'node:test'

import { flatParse, flatStringify } from '../../index.js'
import * as fragments from '../fragments.js'
import { readFile } from '../utils.js'

describe('flat-stringify', () => {
  const initial = readFile('./bookmarks-2.html')

  test('default', () => {
    const parsed = flatParse(initial, { withId: true })
    const actual = flatStringify(parsed)

    equal(actual, initial)
  })

  test('disable `withId` option', () => {
    throws(() => {
      const parsed = flatParse(initial)
      flatStringify(parsed)
    }, /^error: root folder requires an identifier$/i)
  })

  test('fragment', () => {
    const parsed = flatParse(fragments.root, { withId: true })

    const actual = flatStringify(parsed)
    const expected = fragments.template

    equal(actual, expected)
  })

  test('empty', () => {
    const actual = flatStringify([])
    const expected = '<H1>Bookmarks</H1>\n<DL><p>\n</DL><p>'

    ok(actual.includes(expected))
  })
})
