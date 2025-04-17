import { deepEqual } from 'node:assert'
import { describe, test } from 'node:test'

import { parse } from '../index.js'
import { bookmark, bookmarkLower, folder, nestedFolders } from './_samples.js'

describe('parse', () => {
  describe('bookmark format ', () => {
    const initial = bookmark

    const result = {
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

    test('default', () => {
      const actual = parse(initial)
      const expected = [result]

      deepEqual(actual, expected)
    })

    test('with id', () => {
      const actual = parse(initial, { withId: true })
      const expected = [{ ...result, id: '0' }]

      deepEqual(actual, expected)
    })

    test('with excluded attrs', () => {
      const excludeAttrs = ['icon', 'PREVIEWSIZE']
      // eslint-disable-next-line no-unused-vars
      const { icon, previewsize, ...rest } = result

      const actual = parse(initial, { excludeAttrs })
      const expected = [rest]

      deepEqual(actual, expected)
    })

    test('lower case', () => {
      const initial = bookmarkLower

      const actual = parse(initial)
      const expected = [result]

      deepEqual(actual, expected)
    })
  })

  describe('folder format', () => {
    const initial = folder

    const result = {
      add_date: 1739910037000,
      items: [],
      last_modified: 1739910038000,
      personal_toolbar_folder: false,
      title: 'JavaScript',
      unfiled_bookmarks_folder: true
    }

    test('default', () => {
      const actual = parse(initial)
      const expected = [result]

      deepEqual(actual, expected)
    })

    test('with id', () => {
      const actual = parse(initial, { withId: true })
      const expected = [{ ...result, id: '0' }]

      deepEqual(actual, expected)
    })

    test('with excluded attrs', () => {
      const excludeAttrs = [
        'personal_toolbar_folder',
        'unfiled_bookmarks_folder'
      ]
      // eslint-disable-next-line no-unused-vars
      const { personal_toolbar_folder, unfiled_bookmarks_folder, ...rest } =
        result

      const actual = parse(initial, { excludeAttrs })
      const expected = [rest]

      deepEqual(actual, expected)
    })
  })

  describe('nested folders', () => {
    const initial = nestedFolders

    test('default', () => {
      const actual = parse(initial)

      const expected = [
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
      ]

      deepEqual(actual, expected)
    })

    test('with id', () => {
      const actual = parse(initial, { withId: true })

      const expected = [
        {
          description:
            'The MDN Web Docs site provides information about Open Web technologies including HTML, CSS, and APIs for both Web sites and progressive web apps.',
          href: 'https://developer.mozilla.org',
          id: '0',
          title: 'MDN Web Docs'
        },
        {
          id: '1',
          items: [
            {
              href: 'https://tc39.es',
              id: '1.0',
              pid: '1',
              title: 'TC39 - Specifying JavaScript.'
            },
            {
              id: '1.1',
              items: [
                {
                  href: 'https://v8.dev',
                  id: '1.1.0',
                  pid: '1.1',
                  title: 'V8'
                },
                {
                  href: 'https://spidermonkey.dev',
                  id: '1.1.1',
                  pid: '1.1',
                  title: 'SpiderMonkey'
                },
                {
                  href: 'https://developer.apple.com/documentation/javascriptcore',
                  id: '1.1.2',
                  pid: '1.1',
                  title: 'JavaScriptCore'
                }
              ],
              pid: '1',
              title: 'Engines'
            },
            {
              id: '1.2',
              items: [
                {
                  description:
                    "Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
                  href: 'https://nodejs.org',
                  id: '1.2.0',
                  pid: '1.2',
                  title: 'Node.js — Run JavaScript Everywhere'
                },
                {
                  description:
                    "Deno features improved security, performance, and developer experience compared to its predecessor. It's a great time to upgrade your Node.js project to run on Deno.",
                  href: 'https://deno.com',
                  id: '1.2.1',
                  pid: '1.2',
                  title: 'Deno, the next-generation JavaScript runtime'
                },
                {
                  description:
                    'Bundle, install, and run JavaScript & TypeScript — all in Bun. Bun is a new JavaScript runtime with a native bundler, transpiler, task runner, and npm client built-in.',
                  href: 'https://bun.sh',
                  id: '1.2.2',
                  pid: '1.2',
                  title: 'Bun — A fast all-in-one JavaScript runtime'
                }
              ],
              pid: '1',
              title: 'Runtimes'
            }
          ],
          personal_toolbar_folder: false,
          title: 'JavaScript'
        },
        {
          id: '2',
          items: [],
          title: 'CSS'
        }
      ]

      deepEqual(actual, expected)
    })
  })
})
