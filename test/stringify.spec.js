import { deepEqual } from 'node:assert'
import { describe, test } from 'node:test'

import { parse, stringify } from '../index.js'
import {
  documentWithBookmark,
  documentWithFolder,
  documentWithNestedFolders
} from './_samples.js'

describe('stringify', () => {
  test('bookmark format', () => {
    const initial = {
      items: [
        {
          add_date: 1739910037000,
          feed: false,
          feedurl: '',
          href: 'https://www.wikipedia.org',
          icon: 'data:image/png;base64,...',
          icon_uri: '',
          islivepreview: false,
          last_modified: 1739910038000,
          last_visit: 1739910039000,
          previewsize: { h: 10, w: 10 },
          private: false,
          shortcuturl: 'wikipedia',
          tags: ['edu', 'wikipedia'],
          title: 'Wikipedia&nbsp;— The Free Encyclopedia',
          webslice: false
        }
      ],
      title: 'Bookmarks'
    }

    const actual = stringify(initial)
    const expected = documentWithBookmark

    deepEqual(actual, expected)
  })

  test('folder format', () => {
    const initial = {
      items: [
        {
          add_date: 1739910037000,
          items: [],
          last_modified: 1739910038000,
          personal_toolbar_folder: false,
          title: 'JavaScript',
          unfiled_bookmarks_folder: true
        }
      ],
      title: 'Bookmarks'
    }

    const actual = stringify(initial)
    const expected = documentWithFolder

    deepEqual(actual, expected)
  })

  describe('nested folders', () => {
    const initial = {
      items: [
        {
          description:
            'The MDN Web Docs site provides information about Open Web technologies including HTML, CSS, and APIs for both Web sites and progressive web apps.',
          href: 'https://developer.mozilla.org',
          title: 'MDN Web Docs'
        },
        {
          items: [
            {
              href: 'https://tc39.es',
              title: 'TC39 - Specifying JavaScript.'
            },
            {
              items: [
                {
                  href: 'https://v8.dev',
                  title: 'V8'
                },
                {
                  href: 'https://spidermonkey.dev',
                  title: 'SpiderMonkey'
                },
                {
                  href: 'https://developer.apple.com/documentation/javascriptcore',
                  title: 'JavaScriptCore'
                }
              ],
              title: 'Engines'
            },
            {
              items: [
                {
                  description:
                    "Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
                  href: 'https://nodejs.org',
                  title: 'Node.js — Run JavaScript Everywhere'
                },
                {
                  description:
                    "Deno features improved security, performance, and developer experience compared to its predecessor. It's a great time to upgrade your Node.js project to run on Deno.",
                  href: 'https://deno.com',
                  title: 'Deno, the next-generation JavaScript runtime'
                },
                {
                  description:
                    'Bundle, install, and run JavaScript & TypeScript — all in Bun. Bun is a new JavaScript runtime with a native bundler, transpiler, task runner, and npm client built-in.',
                  href: 'https://bun.sh',
                  title: 'Bun — A fast all-in-one JavaScript runtime'
                }
              ],
              title: 'Runtimes'
            }
          ],
          personal_toolbar_folder: false,
          title: 'JavaScript'
        },
        {
          items: [],
          title: 'CSS'
        }
      ],
      title: 'Bookmarks'
    }

    const expected = documentWithNestedFolders

    test('default', () => {
      const actual = stringify(initial)

      deepEqual(actual, expected)
    })

    test('after parse', () => {
      const parsed = parse(expected)
      const actual = stringify(parsed[0])

      deepEqual(expected, actual)
    })
  })
})
