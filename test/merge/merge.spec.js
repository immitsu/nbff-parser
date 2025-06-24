import { deepEqual, ok } from 'node:assert'
import { describe, test } from 'node:test'

import { merge } from '../../index.js'
import { readFile } from '../read-file.js'

describe('merge', () => {
  test('html files', async () => {
    const readHTML = name => readFile(`./merge/${name}.html`)
    const [a, b, c, expected] = ['a', 'b', 'c', 'expected'].map(readHTML)
    const actual = await merge(a, b, c)
    return deepEqual(actual, expected)
  })

  describe('splice bookmarks', () => {
    test('identical', async () => {
      const a = `
        <H1>Bookmarks</H1>
        <DL><p>
            <DT><A HREF="https://foo.com">Foo</A>
        </DL><p>
      `
      const b = `
        <H1>Bookmarks</H1>
        <DL><p>
            <DT><A HREF="https://foo.com">Foo</A>
        </DL><p>
      `

      const actual = await merge(a, b)
      const expected =
        '<DL><p>\n    <DT><A HREF="https://foo.com">Foo</A>\n</DL><p>'

      ok(actual.includes(expected))
    })

    test('with the same title but different href', async () => {
      const a = `
        <H1>Bookmarks</H1>
        <DL><p>
            <DT><A HREF="https://foo.com">Foo</A>
        </DL><p>
      `
      const b = `
        <H1>Bookmarks</H1>
        <DL><p>
            <DT><A HREF="https://bar.com">Foo</A>
        </DL><p>
      `

      const actual = await merge(a, b)
      const expected =
        '<DL><p>\n    <DT><A HREF="https://foo.com">Foo</A>\n    <DT><A HREF="https://bar.com">Foo</A>\n</DL><p>'

      ok(actual.includes(expected))
    })

    test('only the first one has a description', async () => {
      const a = `
        <H1>Bookmarks</H1>
        <DL><p>
            <DT><A HREF="https://foo.com">Foo</A>
            <DD>Description.
        </DL><p>
      `
      const b = `
        <H1>Bookmarks</H1>
        <DL><p>
            <DT><A HREF="https://foo.com">Foo</A>
        </DL><p>
      `

      const actual = await merge(a, b)
      const expected =
        '<DL><p>\n    <DT><A HREF="https://foo.com">Foo</A>\n    <DD>Description.\n</DL><p>'

      ok(actual.includes(expected))
    })

    test('only the second one has a description', async () => {
      const a = `
        <H1>Bookmarks</H1>
        <DL><p>
            <DT><A HREF="https://foo.com">Foo</A>
        </DL><p>
      `
      const b = `
        <H1>Bookmarks</H1>
        <DL><p>
            <DT><A HREF="https://foo.com">Foo</A>
            <DD>Description.
        </DL><p>
      `

      const actual = await merge(a, b)
      const expected =
        '<DL><p>\n    <DT><A HREF="https://foo.com">Foo</A>\n    <DD>Description.\n</DL><p>'

      ok(actual.includes(expected))
    })

    test('both have the same descriptions', async () => {
      const a = `
        <H1>Bookmarks</H1>
        <DL><p>
            <DT><A HREF="https://foo.com">Foo</A>
            <DD>Description.
        </DL><p>
      `
      const b = `
        <H1>Bookmarks</H1>
        <DL><p>
            <DT><A HREF="https://foo.com">Foo</A>
            <DD>Description.
        </DL><p>
      `

      const actual = await merge(a, b)
      const expected =
        '<DL><p>\n    <DT><A HREF="https://foo.com">Foo</A>\n    <DD>Description.\n</DL><p>'

      ok(actual.includes(expected))
    })

    test('both with the different descriptions', async () => {
      const a = `
        <H1>Bookmarks</H1>
        <DL><p>
            <DT><A HREF="https://foo.com">Foo</A>
            <DD>Foo
        </DL><p>
      `
      const b = `
        <H1>Bookmarks</H1>
        <DL><p>
            <DT><A HREF="https://foo.com">Foo</A>
            <DD>Bar
        </DL><p>
      `

      const actual = await merge(a, b)
      const expected =
        '<DL><p>\n    <DT><A HREF="https://foo.com">Foo</A>\n    <DD>Foo\n    <DT><A HREF="https://foo.com">Foo</A>\n    <DD>Bar\n</DL><p>'

      ok(actual.includes(expected))
    })
  })

  describe('splice folders', () => {
    test('use <H1> of the first argument', async () => {
      const a = `
        <TITLE>MyBookmarks</TITLE>
        <H1>MyBookmarks</H1>
        <DL><p>
          <DT><A HREF="https://foo.com">Foo</A>
        </DL><p>
      `
      const b = `
        <TITLE>Bookmarks</TITLE>
        <H1>Bookmarks</H1>
        <DL><p>
        </DL><p>
      `

      const actual = await merge(a, b)
      const expected =
        '<TITLE>Bookmarks</TITLE>\n<H1>MyBookmarks</H1>\n<DL><p>\n    <DT><A HREF="https://foo.com">Foo</A>\n</DL><p>'

      ok(actual.includes(expected))
    })
  })

  test('no arguments', async () => {
    const actual = await merge()
    const expected = '<H1>Bookmarks</H1>\n<DL><p>\n</DL><p>'

    ok(actual.includes(expected))
  })

  test('one argument', async () => {
    const a = `
      <H1>Bookmarks</H1>
      <DL><p>
          <DT><A HREF="https://foo.com">Foo</A>
      </DL><p>
    `
    const actual = await merge(a)
    const expected =
      '<H1>Bookmarks</H1>\n<DL><p>\n    <DT><A HREF="https://foo.com">Foo</A>\n</DL><p>'

    ok(actual.includes(expected))
  })
})
