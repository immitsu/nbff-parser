import { equal, throws } from 'node:assert'
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
    const parsed = flatParse(fragments.folder, { withId: true })

    const actual = flatStringify(parsed)

    const expected = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Edu</H1>
<DL><p>
    ${fragments.bookmark}
</DL><p>
`

    equal(actual, expected)
  })
})
