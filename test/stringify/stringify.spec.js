import { equal, ok } from 'node:assert'
import { describe, test } from 'node:test'

import { parse, stringify } from '../../index.js'
import { readFile } from '../read-file.js'

describe('stringify', () => {
  test('read html files', () => {
    ;['./bookmarks-1.html', './bookmarks-2.html'].forEach(file => {
      const initial = readFile(file)
      const parsed = parse(initial)

      const actual = stringify(parsed)

      equal(actual, initial)
    })
  })

  test('empty', () => {
    const actual = stringify({ items: [], title: 'foo' })
    const expected = '<H1>foo</H1>\n<DL><p>\n</DL><p>'

    ok(actual.includes(expected))
  })
})
