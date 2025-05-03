import { equal } from 'node:assert'
import { describe, test } from 'node:test'

import { parse, stringify } from '../../index.js'
import * as fragments from '../fragments.js'
import { readFile } from '../utils.js'

describe('stringify', () => {
  test('files', () => {
    ;['./bookmarks-1.html', './bookmarks-2.html'].forEach(file => {
      const initial = readFile(file)
      const parsed = parse(initial)

      const actual = stringify(parsed)

      equal(actual, initial)
    })
  })

  test('fragment', () => {
    const parsed = parse(fragments.folder)

    const actual = stringify(parsed)

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
