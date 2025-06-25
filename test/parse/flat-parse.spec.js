/* eslint-disable no-unused-vars */
import { deepEqual } from 'node:assert'
import { describe, test } from 'node:test'

import { flatParse } from '../../index.js'
import * as fragments from '../fragments.js'
import { readFile } from '../read-file.js'

describe('flat-parse', () => {
  describe('folder from `../fragments.js`', () => {
    const expected = [
      {
        add_date: 1739910037000,
        feed: false,
        feedurl: 'https://...',
        folder: [
          {
            add_date: 1739910037000,
            last_modified: 1739910038000,
            personal_toolbar_folder: false,
            title: 'Edu',
            unfiled_bookmarks_folder: true
          }
        ],
        href: 'https://www.wikipedia.org',
        icon: 'data:image/png;base64,...',
        icon_uri: 'https://...',
        islivepreview: false,
        last_modified: 1739910038000,
        last_visit: 1739910039000,
        previewsize: { h: 12, w: 12 },
        private: false,
        shortcuturl: 'wikipedia',
        tags: ['edu', 'wikipedia'],
        title: 'Wikipedia&nbsp;— The Free Encyclopedia',
        webslice: false
      }
    ]

    test('default', () => {
      const actual = flatParse(fragments.folder)

      deepEqual(actual, expected)
    })

    test('with excluded attrs', () => {
      const excludeAttrs = ['personal_toolbar_folder']

      const actual = flatParse(fragments.folder, { excludeAttrs })

      const bookmark = expected[0]
      const { personal_toolbar_folder, ...newFolder } = bookmark.folder[0]
      const expectedWithExcludedAttrs = [{ ...bookmark, folder: [newFolder] }]

      deepEqual(actual, expectedWithExcludedAttrs)
    })

    test('single quotes', () => {
      const initial = fragments.folder.replaceAll('"', "'")
      const actual = flatParse(initial)

      deepEqual(actual, expected)
    })
  })

  test('empty fragment', () => {
    const initial = `
      <H1>Bookmarks</H1>
      <DL><p>
      </DL><p>
    `

    const actual = flatParse(initial)

    const expected = []

    deepEqual(actual, expected)
  })

  describe('bookmarks-1.html', () => {
    const initial = readFile('./bookmarks-1.html')

    test('default', () => {
      const actual = flatParse(initial)

      const expected = [
        {
          folder: [
            {
              title: 'Bookmarks'
            }
          ],
          href: 'https://developer.mozilla.org/ru/',
          title: 'MDN Web Docs'
        },
        {
          folder: [
            {
              title: 'Bookmarks'
            },
            {
              title: 'JavaScript'
            }
          ],
          href: 'https://tc39.es/',
          title: 'TC39 - Specifying JavaScript.'
        },
        {
          folder: [
            {
              title: 'Bookmarks'
            },
            {
              title: 'JavaScript'
            },
            {
              title: 'Engines'
            }
          ],
          href: 'https://v8.dev/',
          title: 'V8 JavaScript engine'
        },
        {
          folder: [
            {
              title: 'Bookmarks'
            },
            {
              title: 'JavaScript'
            },
            {
              title: 'Engines'
            }
          ],
          href: 'https://spidermonkey.dev/',
          title: 'Home | SpiderMonkey JavaScript/WebAssembly Engine'
        },
        {
          description:
            "Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
          folder: [
            {
              title: 'Bookmarks'
            },
            {
              title: 'JavaScript'
            },
            {
              title: 'Runtimes'
            }
          ],
          href: 'https://nodejs.org/en',
          title: 'Node.js — Run JavaScript Everywhere'
        },
        {
          description:
            "Deno features improved security, performance, and developer experience compared to its predecessor. It's a great time to upgrade your Node.js project to run on Deno.",
          folder: [
            {
              title: 'Bookmarks'
            },
            {
              title: 'JavaScript'
            },
            {
              title: 'Runtimes'
            }
          ],
          href: 'https://deno.com/',
          title: 'Deno, the next-generation JavaScript runtime'
        },
        {
          folder: [
            {
              title: 'Bookmarks'
            }
          ],
          href: 'https://en.wikipedia.org/wiki/Main_Page',
          title: 'Wikipedia, the free encyclopedia'
        }
      ]

      deepEqual(actual, expected)
    })

    test('with id', () => {
      const actual = flatParse(initial, { withId: true })

      const expected = [
        {
          folder: [
            {
              id: 0,
              title: 'Bookmarks'
            }
          ],
          href: 'https://developer.mozilla.org/ru/',
          id: 2,
          title: 'MDN Web Docs'
        },
        {
          folder: [
            {
              id: 0,
              title: 'Bookmarks'
            },
            {
              id: 3,
              title: 'JavaScript'
            }
          ],
          href: 'https://tc39.es/',
          id: 4,
          title: 'TC39 - Specifying JavaScript.'
        },
        {
          folder: [
            {
              id: 0,
              title: 'Bookmarks'
            },
            {
              id: 3,
              title: 'JavaScript'
            },
            {
              id: 5,
              title: 'Engines'
            }
          ],
          href: 'https://v8.dev/',
          id: 6,
          title: 'V8 JavaScript engine'
        },
        {
          folder: [
            {
              id: 0,
              title: 'Bookmarks'
            },
            {
              id: 3,
              title: 'JavaScript'
            },
            {
              id: 5,
              title: 'Engines'
            }
          ],
          href: 'https://spidermonkey.dev/',
          id: 7,
          title: 'Home | SpiderMonkey JavaScript/WebAssembly Engine'
        },
        {
          description:
            "Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
          folder: [
            {
              id: 0,
              title: 'Bookmarks'
            },
            {
              id: 3,
              title: 'JavaScript'
            },
            {
              id: 8,
              title: 'Runtimes'
            }
          ],
          href: 'https://nodejs.org/en',
          id: 9,
          title: 'Node.js — Run JavaScript Everywhere'
        },
        {
          description:
            "Deno features improved security, performance, and developer experience compared to its predecessor. It's a great time to upgrade your Node.js project to run on Deno.",
          folder: [
            {
              id: 0,
              title: 'Bookmarks'
            },
            {
              id: 3,
              title: 'JavaScript'
            },
            {
              id: 8,
              title: 'Runtimes'
            }
          ],
          href: 'https://deno.com/',
          id: 10,
          title: 'Deno, the next-generation JavaScript runtime'
        },
        {
          folder: [
            {
              id: 0,
              title: 'Bookmarks'
            }
          ],
          href: 'https://en.wikipedia.org/wiki/Main_Page',
          id: 11,
          title: 'Wikipedia, the free encyclopedia'
        }
      ]

      deepEqual(actual, expected)
    })
  })
})
