/* eslint-disable no-unused-vars */
import { deepEqual } from 'node:assert'
import { describe, test } from 'node:test'

import { flatParse } from '../../index.js'
import { fragment } from '../fragment.js'
import { readFile } from '../utils.js'

describe('flat-parse', () => {
  describe('fragment', () => {
    const result = {
      add_date: 1739910037000,
      feed: false,
      feedurl: '',
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

    test('default', () => {
      const actual = flatParse(fragment)
      const expected = [result]

      deepEqual(actual, expected)
    })

    test('with id', () => {
      const anotherResult = {
        ...result,
        folder: [{ ...result.folder[0], id: 0 }],
        id: 1
      }

      const actual = flatParse(fragment, { withId: true })
      const expected = [anotherResult]

      deepEqual(actual, expected)
    })

    test('with excluded attrs', () => {
      const excludeAttrs = [
        'personal_toolbar_folder',
        'unfiled_bookmarks_folder'
      ]

      const {
        personal_toolbar_folder,
        unfiled_bookmarks_folder,
        ...anotherFolder
      } = result.folder[0]

      const anotherResult = { ...result, folder: [anotherFolder] }

      const actual = flatParse(fragment, { excludeAttrs })
      const expected = [anotherResult]

      deepEqual(actual, expected)
    })
  })

  describe('bookmarks-1.html', () => {
    const initial = readFile('./bookmarks-1.html')

    test('default', () => {
      const actual = flatParse(initial)

      const expected = [
        {
          add_date: 1745224163000,
          folder: [
            {
              title: 'Bookmarks'
            }
          ],
          href: 'https://developer.mozilla.org/ru/',
          title: 'MDN Web Docs'
        },
        {
          add_date: 1745224197000,
          folder: [
            {
              title: 'Bookmarks'
            },
            {
              add_date: 1745224467000,
              last_modified: 1745224547000,
              title: 'JavaScript'
            }
          ],
          href: 'https://tc39.es/',
          title: 'TC39 - Specifying JavaScript.'
        },
        {
          add_date: 1745224509000,
          folder: [
            {
              title: 'Bookmarks'
            },
            {
              add_date: 1745224467000,
              last_modified: 1745224547000,
              title: 'JavaScript'
            },
            {
              add_date: 1745224489000,
              last_modified: 1745224528000,
              title: 'Engines'
            }
          ],
          href: 'https://v8.dev/',
          title: 'V8 JavaScript engine'
        },
        {
          add_date: 1745224509000,
          folder: [
            {
              title: 'Bookmarks'
            },
            {
              add_date: 1745224467000,
              last_modified: 1745224547000,
              title: 'JavaScript'
            },
            {
              add_date: 1745224489000,
              last_modified: 1745224528000,
              title: 'Engines'
            }
          ],
          href: 'https://spidermonkey.dev/',
          title: 'Home | SpiderMonkey JavaScript/WebAssembly Engine'
        },
        {
          add_date: 1745224555000,
          description:
            "Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
          folder: [
            {
              title: 'Bookmarks'
            },
            {
              add_date: 1745224467000,
              last_modified: 1745224547000,
              title: 'JavaScript'
            },
            {
              add_date: 1745224547000,
              last_modified: 1745224555000,
              title: 'Runtimes'
            }
          ],
          href: 'https://nodejs.org/en',
          title: 'Node.js — Run JavaScript Everywhere'
        },
        {
          add_date: 1745224555000,
          description:
            "Deno features improved security, performance, and developer experience compared to its predecessor. It's a great time to upgrade your Node.js project to run on Deno.",
          folder: [
            {
              title: 'Bookmarks'
            },
            {
              add_date: 1745224467000,
              last_modified: 1745224547000,
              title: 'JavaScript'
            },
            {
              add_date: 1745224547000,
              last_modified: 1745224555000,
              title: 'Runtimes'
            }
          ],
          href: 'https://deno.com/',
          title: 'Deno, the next-generation JavaScript runtime'
        },
        {
          add_date: 1745224424000,
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
          add_date: 1745224163000,
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
          add_date: 1745224197000,
          folder: [
            {
              id: 0,
              title: 'Bookmarks'
            },
            {
              add_date: 1745224467000,
              id: 3,
              last_modified: 1745224547000,
              title: 'JavaScript'
            }
          ],
          href: 'https://tc39.es/',
          id: 4,
          title: 'TC39 - Specifying JavaScript.'
        },
        {
          add_date: 1745224509000,
          folder: [
            {
              id: 0,
              title: 'Bookmarks'
            },
            {
              add_date: 1745224467000,
              id: 3,
              last_modified: 1745224547000,
              title: 'JavaScript'
            },
            {
              add_date: 1745224489000,
              id: 5,
              last_modified: 1745224528000,
              title: 'Engines'
            }
          ],
          href: 'https://v8.dev/',
          id: 6,
          title: 'V8 JavaScript engine'
        },
        {
          add_date: 1745224509000,
          folder: [
            {
              id: 0,
              title: 'Bookmarks'
            },
            {
              add_date: 1745224467000,
              id: 3,
              last_modified: 1745224547000,
              title: 'JavaScript'
            },
            {
              add_date: 1745224489000,
              id: 5,
              last_modified: 1745224528000,
              title: 'Engines'
            }
          ],
          href: 'https://spidermonkey.dev/',
          id: 7,
          title: 'Home | SpiderMonkey JavaScript/WebAssembly Engine'
        },
        {
          add_date: 1745224555000,
          description:
            "Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
          folder: [
            {
              id: 0,
              title: 'Bookmarks'
            },
            {
              add_date: 1745224467000,
              id: 3,
              last_modified: 1745224547000,
              title: 'JavaScript'
            },
            {
              add_date: 1745224547000,
              id: 8,
              last_modified: 1745224555000,
              title: 'Runtimes'
            }
          ],
          href: 'https://nodejs.org/en',
          id: 9,
          title: 'Node.js — Run JavaScript Everywhere'
        },
        {
          add_date: 1745224555000,
          description:
            "Deno features improved security, performance, and developer experience compared to its predecessor. It's a great time to upgrade your Node.js project to run on Deno.",
          folder: [
            {
              id: 0,
              title: 'Bookmarks'
            },
            {
              add_date: 1745224467000,
              id: 3,
              last_modified: 1745224547000,
              title: 'JavaScript'
            },
            {
              add_date: 1745224547000,
              id: 8,
              last_modified: 1745224555000,
              title: 'Runtimes'
            }
          ],
          href: 'https://deno.com/',
          id: 10,
          title: 'Deno, the next-generation JavaScript runtime'
        },
        {
          add_date: 1745224424000,
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
