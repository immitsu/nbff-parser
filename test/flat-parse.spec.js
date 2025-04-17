import { deepEqual } from 'node:assert'
import { describe, test } from 'node:test'

import { flatParse } from '../index.js'
import { bookmark, folderWithBookmark, nestedFolders } from './_samples.js'

describe('flat-parse', () => {
  describe('bookmark format', () => {
    const initial = bookmark

    const result = {
      add_date: 1739910037000,
      feed: false,
      feedurl: '',
      folder: [],
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
      const actual = flatParse(initial)
      const expected = [result]

      deepEqual(actual, expected)
    })

    test('with excluded attrs', () => {
      const excludeAttrs = ['icon', 'TAGS']
      // eslint-disable-next-line no-unused-vars
      const { icon, tags, ...rest } = result

      const actual = flatParse(initial, { excludeAttrs })
      const expected = [rest]

      deepEqual(actual, expected)
    })
  })

  describe('folder format', () => {
    const initial = folderWithBookmark

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
      const actual = flatParse(initial)
      const expected = [result]

      deepEqual(actual, expected)
    })

    test('with id', () => {
      const actual = flatParse(initial, { withId: true })
      const expected = [
        {
          ...result,
          folder: [{ ...result.folder[0], id: 0 }],
          id: 1
        }
      ]

      deepEqual(actual, expected)
    })

    test('with excluded attrs', () => {
      const excludeAttrs = ['islivepreview', 'PREVIEWSIZE']
      // eslint-disable-next-line no-unused-vars
      const { islivepreview, previewsize, ...rest } = result

      const actual = flatParse(initial, { excludeAttrs })
      const expected = [rest]

      deepEqual(actual, expected)
    })
  })

  describe('nested folders', () => {
    const initial = nestedFolders

    test('default', () => {
      const actual = flatParse(initial)

      const expected = [
        {
          description:
            'The MDN Web Docs site provides information about Open Web technologies including HTML, CSS, and APIs for both Web sites and progressive web apps.',
          folder: [],
          href: 'https://developer.mozilla.org',
          title: 'MDN Web Docs'
        },
        {
          folder: [
            {
              personal_toolbar_folder: false,
              title: 'JavaScript'
            }
          ],
          href: 'https://tc39.es',
          title: 'TC39 - Specifying JavaScript.'
        },
        {
          folder: [
            {
              personal_toolbar_folder: false,
              title: 'JavaScript'
            },
            {
              title: 'Engines'
            }
          ],
          href: 'https://v8.dev',
          title: 'V8'
        },
        {
          folder: [
            {
              personal_toolbar_folder: false,
              title: 'JavaScript'
            },
            {
              title: 'Engines'
            }
          ],
          href: 'https://spidermonkey.dev',
          title: 'SpiderMonkey'
        },
        {
          folder: [
            {
              personal_toolbar_folder: false,
              title: 'JavaScript'
            },
            {
              title: 'Engines'
            }
          ],
          href: 'https://developer.apple.com/documentation/javascriptcore',
          title: 'JavaScriptCore'
        },
        {
          description:
            "Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
          folder: [
            {
              personal_toolbar_folder: false,
              title: 'JavaScript'
            },
            {
              title: 'Runtimes'
            }
          ],
          href: 'https://nodejs.org',
          title: 'Node.js — Run JavaScript Everywhere'
        },
        {
          description:
            "Deno features improved security, performance, and developer experience compared to its predecessor. It's a great time to upgrade your Node.js project to run on Deno.",
          folder: [
            {
              personal_toolbar_folder: false,
              title: 'JavaScript'
            },
            {
              title: 'Runtimes'
            }
          ],
          href: 'https://deno.com',
          title: 'Deno, the next-generation JavaScript runtime'
        },
        {
          description:
            'Bundle, install, and run JavaScript & TypeScript — all in Bun. Bun is a new JavaScript runtime with a native bundler, transpiler, task runner, and npm client built-in.',
          folder: [
            {
              personal_toolbar_folder: false,
              title: 'JavaScript'
            },
            {
              title: 'Runtimes'
            }
          ],
          href: 'https://bun.sh',
          title: 'Bun — A fast all-in-one JavaScript runtime'
        }
      ]

      deepEqual(actual, expected)
    })

    test('with id', () => {
      const actual = flatParse(initial, { withId: true })

      const expected = [
        {
          description:
            'The MDN Web Docs site provides information about Open Web technologies including HTML, CSS, and APIs for both Web sites and progressive web apps.',
          folder: [],
          href: 'https://developer.mozilla.org',
          id: 0,
          title: 'MDN Web Docs'
        },
        {
          folder: [
            {
              id: 1,
              personal_toolbar_folder: false,
              title: 'JavaScript'
            }
          ],
          href: 'https://tc39.es',
          id: 2,
          title: 'TC39 - Specifying JavaScript.'
        },
        {
          folder: [
            {
              id: 1,
              personal_toolbar_folder: false,
              title: 'JavaScript'
            },
            {
              id: 3,
              title: 'Engines'
            }
          ],
          href: 'https://v8.dev',
          id: 4,
          title: 'V8'
        },
        {
          folder: [
            {
              id: 1,
              personal_toolbar_folder: false,
              title: 'JavaScript'
            },
            {
              id: 3,
              title: 'Engines'
            }
          ],
          href: 'https://spidermonkey.dev',
          id: 5,
          title: 'SpiderMonkey'
        },
        {
          folder: [
            {
              id: 1,
              personal_toolbar_folder: false,
              title: 'JavaScript'
            },
            {
              id: 3,
              title: 'Engines'
            }
          ],
          href: 'https://developer.apple.com/documentation/javascriptcore',
          id: 6,
          title: 'JavaScriptCore'
        },
        {
          description:
            "Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
          folder: [
            {
              id: 1,
              personal_toolbar_folder: false,
              title: 'JavaScript'
            },
            {
              id: 7,
              title: 'Runtimes'
            }
          ],
          href: 'https://nodejs.org',
          id: 8,
          title: 'Node.js — Run JavaScript Everywhere'
        },
        {
          description:
            "Deno features improved security, performance, and developer experience compared to its predecessor. It's a great time to upgrade your Node.js project to run on Deno.",
          folder: [
            {
              id: 1,
              personal_toolbar_folder: false,
              title: 'JavaScript'
            },
            {
              id: 7,
              title: 'Runtimes'
            }
          ],
          href: 'https://deno.com',
          id: 9,
          title: 'Deno, the next-generation JavaScript runtime'
        },
        {
          description:
            'Bundle, install, and run JavaScript & TypeScript — all in Bun. Bun is a new JavaScript runtime with a native bundler, transpiler, task runner, and npm client built-in.',
          folder: [
            {
              id: 1,
              personal_toolbar_folder: false,
              title: 'JavaScript'
            },
            {
              id: 7,
              title: 'Runtimes'
            }
          ],
          href: 'https://bun.sh',
          id: 10,
          title: 'Bun — A fast all-in-one JavaScript runtime'
        }
      ]

      deepEqual(actual, expected)
    })
  })
})
