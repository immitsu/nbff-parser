import { equal, ok, throws } from 'node:assert'
import { describe, test } from 'node:test'

import { flatParse, flatStringify } from '../../index.js'
import * as fragments from '../fragments.js'
import { readFile } from '../read-file.js'

describe('flat-stringify', () => {
  const html = readFile('./bookmarks-2.html')

  test('default', () => {
    const parsed = flatParse(html, { withId: true })
    const actual = flatStringify(parsed)

    equal(actual, html)
  })

  test('disable `withId` option', () => {
    throws(() => {
      const parsed = flatParse(html)
      flatStringify(parsed)
    }, /Error: Folders must have identifiers/)
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
