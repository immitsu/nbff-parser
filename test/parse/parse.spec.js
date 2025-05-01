/* eslint-disable no-unused-vars */
import { deepEqual } from 'node:assert'
import { describe, test } from 'node:test'

import { parse } from '../../index.js'
import { fragment } from '../fragment.js'
import { readFile } from '../utils.js'

describe('parse', () => {
  describe('fragment', () => {
    const result = {
      add_date: 1739910037000,
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
      last_modified: 1739910038000,
      personal_toolbar_folder: false,
      title: 'Edu',
      unfiled_bookmarks_folder: true
    }

    test('default', () => {
      const actual = parse(fragment)
      const expected = result

      deepEqual(actual, expected)
    })

    test('with id', () => {
      const anotherResult = {
        ...result,
        id: '0',
        items: [
          {
            ...result.items[0],
            id: '0.0',
            pid: '0'
          }
        ]
      }

      const actual = parse(fragment, { withId: true })
      const expected = anotherResult

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
        ...anotherResult
      } = result

      const actual = parse(fragment, { excludeAttrs })
      const expected = anotherResult

      deepEqual(actual, expected)
    })

    test('lower case', () => {
      const initial = fragment.toLowerCase()

      const anotherResult = {
        ...result,
        items: [
          {
            ...result.items[0],
            title: result.items[0].title.toLowerCase()
          }
        ],
        title: result.title.toLowerCase()
      }

      const actual = parse(initial)
      const expected = anotherResult

      deepEqual(actual, expected)
    })
  })

  describe('bookmarks-1.html', () => {
    const initial = readFile('./bookmarks-1.html')

    test('default', () => {
      const actual = parse(initial)

      const expected = {
        items: [
          {
            add_date: 1739906039000,
            items: [],
            last_modified: 0,
            personal_toolbar_folder: true,
            title: 'Toolbar'
          },
          {
            add_date: 1745224163000,
            href: 'https://developer.mozilla.org/ru/',
            title: 'MDN Web Docs'
          },
          {
            add_date: 1745224467000,
            items: [
              {
                add_date: 1745224197000,
                href: 'https://tc39.es/',
                title: 'TC39 - Specifying JavaScript.'
              },
              {
                add_date: 1745224489000,
                items: [
                  {
                    add_date: 1745224509000,
                    href: 'https://v8.dev/',
                    title: 'V8 JavaScript engine'
                  },
                  {
                    add_date: 1745224509000,
                    href: 'https://spidermonkey.dev/',
                    title: 'Home | SpiderMonkey JavaScript/WebAssembly Engine'
                  }
                ],
                last_modified: 1745224528000,
                title: 'Engines'
              },
              {
                add_date: 1745224547000,
                items: [
                  {
                    add_date: 1745224555000,
                    description:
                      "Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
                    href: 'https://nodejs.org/en',
                    title: 'Node.js — Run JavaScript Everywhere'
                  },
                  {
                    add_date: 1745224555000,
                    description:
                      "Deno features improved security, performance, and developer experience compared to its predecessor. It's a great time to upgrade your Node.js project to run on Deno.",
                    href: 'https://deno.com/',
                    title: 'Deno, the next-generation JavaScript runtime'
                  }
                ],
                last_modified: 1745224555000,
                title: 'Runtimes'
              }
            ],
            last_modified: 1745224547000,
            title: 'JavaScript'
          },
          {
            add_date: 1745224424000,
            href: 'https://en.wikipedia.org/wiki/Main_Page',
            title: 'Wikipedia, the free encyclopedia'
          }
        ],
        title: 'Bookmarks'
      }

      deepEqual(actual, expected)
    })

    test('with id', () => {
      const actual = parse(initial, { withId: true })

      const expected = {
        id: '0',
        items: [
          {
            add_date: 1739906039000,
            id: '0.0',
            items: [],
            last_modified: 0,
            personal_toolbar_folder: true,
            pid: '0',
            title: 'Toolbar'
          },
          {
            add_date: 1745224163000,
            href: 'https://developer.mozilla.org/ru/',
            id: '0.1',
            pid: '0',
            title: 'MDN Web Docs'
          },
          {
            add_date: 1745224467000,
            id: '0.2',
            items: [
              {
                add_date: 1745224197000,
                href: 'https://tc39.es/',
                id: '0.2.0',
                pid: '0.2',
                title: 'TC39 - Specifying JavaScript.'
              },
              {
                add_date: 1745224489000,
                id: '0.2.1',
                items: [
                  {
                    add_date: 1745224509000,
                    href: 'https://v8.dev/',
                    id: '0.2.1.0',
                    pid: '0.2.1',
                    title: 'V8 JavaScript engine'
                  },
                  {
                    add_date: 1745224509000,
                    href: 'https://spidermonkey.dev/',
                    id: '0.2.1.1',
                    pid: '0.2.1',
                    title: 'Home | SpiderMonkey JavaScript/WebAssembly Engine'
                  }
                ],
                last_modified: 1745224528000,
                pid: '0.2',
                title: 'Engines'
              },
              {
                add_date: 1745224547000,
                id: '0.2.2',
                items: [
                  {
                    add_date: 1745224555000,
                    description:
                      "Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
                    href: 'https://nodejs.org/en',
                    id: '0.2.2.0',
                    pid: '0.2.2',
                    title: 'Node.js — Run JavaScript Everywhere'
                  },
                  {
                    add_date: 1745224555000,
                    description:
                      "Deno features improved security, performance, and developer experience compared to its predecessor. It's a great time to upgrade your Node.js project to run on Deno.",
                    href: 'https://deno.com/',
                    id: '0.2.2.1',
                    pid: '0.2.2',
                    title: 'Deno, the next-generation JavaScript runtime'
                  }
                ],
                last_modified: 1745224555000,
                pid: '0.2',
                title: 'Runtimes'
              }
            ],
            last_modified: 1745224547000,
            pid: '0',
            title: 'JavaScript'
          },
          {
            add_date: 1745224424000,
            href: 'https://en.wikipedia.org/wiki/Main_Page',
            id: '0.3',
            pid: '0',
            title: 'Wikipedia, the free encyclopedia'
          }
        ],
        title: 'Bookmarks'
      }

      deepEqual(actual, expected)
    })
  })
})
