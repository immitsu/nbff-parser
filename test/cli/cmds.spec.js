import assert from 'node:assert'
import fs from 'node:fs/promises'
import test from 'node:test'

import { exclude, merge } from '../../cli/cmds.js'

let originalReadFile
let originalWriteFile

test.beforeEach(() => {
  originalReadFile = fs.readFile
  originalWriteFile = fs.writeFile
})

test.afterEach(() => {
  fs.readFile = originalReadFile
  fs.writeFile = originalWriteFile
})

const mockFiles = {
  'bar.html': `
    <TITLE>MyBookmarks</TITLE>
    <H1>MyBookmarks</H1>
    <DL><p>
      <DT><A HREF="https://foo.com">Foo</A>
    </DL><p>
  `,
  'baz.html': `
    <TITLE>Bookmarks</TITLE>
    <H1>Bookmarks</H1>
    <DL><p>
      <DT><A ADD_DATE="1739910037" LAST_VISIT="1739910039" HREF="https://baz.com">Baz</A>
    </DL><p>
  `,
  'foo.html': `
    <TITLE>Bookmarks</TITLE>
    <H1>Bookmarks</H1>
    <DL><p>
        <DT><A HREF="https://bar.com">Bar</A>
    </DL><p>
  `
}

const mockFileSystem = () => {
  fs.readFile = async path => {
    if (mockFiles[path]) return mockFiles[path]
    throw new Error(`File not found: ${path}`)
  }

  let writtenPath = null
  let writtenContent = null

  fs.writeFile = async (path, content) => {
    writtenContent = content
    writtenPath = path
  }

  return {
    getWritten: () => ({
      writtenContent,
      writtenPath
    }),
    resetWritten: () => {
      writtenContent = null
      writtenPath = null
    }
  }
}

test.describe('exclude', () => {
  test('rejects input file that is not .html', async () => {
    const message = await exclude('invalid.txt', ['attr'])
    assert.match(message, /File "invalid.txt" must have a .html extension/)
  })

  test('excludes attributes and writes to a new file', async () => {
    const { getWritten } = mockFileSystem()

    const message = await exclude(
      'baz.html',
      ['add_date', 'last_visit'],
      'output.html'
    )

    const { writtenContent, writtenPath } = getWritten()

    assert.equal(writtenPath, 'output.html')
    assert.match(message, /excluded and file saved as output.html/)
    assert.ok(
      writtenContent.includes(
        '<DL><p>\n    <DT><A HREF="https://baz.com">Baz</A>\n</DL><p>'
      )
    )
  })

  test('excludes attributes and overwrites the original file', async () => {
    const { getWritten } = mockFileSystem()

    const message = await exclude('baz.html', ['add_date', 'last_visit'])

    const { writtenContent, writtenPath } = getWritten()

    assert.equal(writtenPath, 'baz.html')
    assert.match(message, /excluded and file saved as baz.html/)
    assert.ok(
      writtenContent.includes(
        '<DL><p>\n    <DT><A HREF="https://baz.com">Baz</A>\n</DL><p>'
      )
    )
  })

  test('throws on fs.writeFile failure', async () => {
    fs.readFile = async () => {
      return `
        <TITLE>Bookmarks</TITLE>
        <H1>Bookmarks</H1>
        <DL><p>
        </DL><p>
      `
    }
    fs.writeFile = async () => {
      throw new Error('Disk full')
    }

    const message = await exclude('foo.html', ['add_date'], 'out.html')

    assert.match(message, /Error during excluding: Disk full/)
  })
})

test.describe('merge', () => {
  test('rejects input files that are not .html', async () => {
    const message = await merge('a.html,b.txt', 'out.html')

    assert.match(message, /must have a \.html extension/)
  })

  test('throws on fs.readFile failure', async () => {
    fs.readFile = async () => {
      throw new Error('Read error')
    }
    fs.writeFile = async () => {
      throw new Error('Should not be called')
    }

    const message = await merge('file1.html', 'out.html')

    assert.match(message, /^Error during merge: Read error/)
  })

  test('merges successfully', async () => {
    const { getWritten } = mockFileSystem()

    const message = await merge('bar.html,foo.html', 'out.html')

    const { writtenContent, writtenPath } = getWritten()

    assert.equal(message, 'Files merged successfully into out.html')
    assert.equal(writtenPath, 'out.html')
    assert.ok(
      writtenContent.includes(
        '<DL><p>\n    <DT><A HREF="https://foo.com">Foo</A>\n    <DT><A HREF="https://bar.com">Bar</A>\n</DL><p>'
      )
    )
  })
})
