import { equal, ok, throws } from 'node:assert'
import { describe, test } from 'node:test'

import { flatParse, flatStringify } from '../../index.js'
import { readFile } from '../read-file.js'

describe('flat-stringify', () => {
  const html = readFile('./bookmarks-2.html')

  test('default', () => {
    const parsed = flatParse(html, { withId: true })
    const actual = flatStringify(parsed)

    equal(actual, html)
  })

  test('disable `withId` option', () => {
    const parsed = flatParse(html)
    throws(
      () => flatStringify(parsed),
      /Error: Folder must have a unique identifier/
    )
  })

  test('empty', () => {
    const actual = flatStringify([])
    const expected = '<H1>Bookmarks</H1>\n<DL><p>\n</DL><p>'

    ok(actual.includes(expected))
  })
})
