import { deepEqual } from 'node:assert'
import { describe, test } from 'node:test'

import { parse } from '../../index.js'
import * as fragments from '../fragments.js'
import { readFile } from '../read-file.js'

describe('parse', () => {
  describe('folder from `../fragments.js`', () => {
    const expected = {
      add_date: 1739910037000,
      items: [
        {
          add_date: 1739910037000,
          feed: false,
          feedurl: 'https://...',
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
      ],
      last_modified: 1739910038000,
      personal_toolbar_folder: false,
      title: 'Edu',
      unfiled_bookmarks_folder: true
    }

    test('default', () => {
      const actual = parse(fragments.folder)

      deepEqual(actual, expected)
    })

    test('with excluded attrs', () => {
      const excludeAttrs = ['personal_toolbar_folder']

      const actual = parse(fragments.folder, { excludeAttrs })

      // eslint-disable-next-line no-unused-vars
      const { personal_toolbar_folder, ...expectedWithExcludedAttrs } = expected

      deepEqual(actual, expectedWithExcludedAttrs)
    })

    test('lower case', () => {
      const initial = fragments.folder.toLowerCase()

      const actual = parse(initial)

      const expectedLowerCased = {
        ...expected,
        items: [
          {
            ...expected.items[0],
            title: expected.items[0].title.toLowerCase()
          }
        ],
        title: expected.title.toLowerCase()
      }

      deepEqual(actual, expectedLowerCased)
    })

    test('single quotes', () => {
      const initial = fragments.folder.replaceAll('"', "'")
      const actual = parse(initial)

      deepEqual(actual, expected)
    })

    test('without last </DL>', () => {
      const initial = fragments.folder.replace('</DL><p>', '')
      const actual = parse(initial)

      deepEqual(actual, expected)
    })

    test('without closing </DL> at all', () => {
      const initial = `
        <DT><H3>Folder1</H3>
        <DL><p>
            <DT><H3>Folder2</H3>
            <DL><p>
                <DT><H3>Folder3</H3>
                <DL><p>
      `

      const actual = parse(initial)

      const expected = {
        items: [
          {
            items: [
              {
                items: [],
                title: 'Folder3'
              }
            ],
            title: 'Folder2'
          }
        ],
        title: 'Folder1'
      }

      deepEqual(actual, expected)
    })

    test('with transform', () => {
      const initial = `
        <DT><H3>JavaScript</H3>
        <DL><p>
            <DT><A HREF="https://developer.mozilla.org/" ADD_DATE="1745224163">MDN Web Docs</A>
            <DT><A HREF="https://tc39.es/" PERSONAL_TOOLBAR_FOLDER="true">TC39 - Specifying JavaScript.</A>
            <DT><H3>Engines</H3>
            <DL><p>
                <DT><A HREF="https://v8.dev/">V8 JavaScript engine</A>
            </DL><p>
        </DL><p>
      `

      const transform = item => {
        if (item.personal_toolbar_folder) return

        return {
          title: item.title,
          url: item.href
        }
      }

      const actual = parse(initial, { transform })

      const expected = {
        items: [
          {
            title: 'MDN Web Docs',
            url: 'https://developer.mozilla.org/'
          },
          {
            items: [
              {
                title: 'V8 JavaScript engine',
                url: 'https://v8.dev/'
              }
            ],
            title: 'Engines'
          }
        ],
        title: 'JavaScript'
      }

      deepEqual(actual, expected)
    })
  })

  test('empty fragment', () => {
    const initial = `
      <H1>Bookmarks</H1>
      <DL><p>
      </DL><p>
    `

    const actual = parse(initial)

    const expected = {
      items: [],
      title: 'Bookmarks'
    }

    deepEqual(actual, expected)
  })

  describe('bookmarks-1.html', () => {
    const initial = readFile('./bookmarks-1.html')

    test('default', () => {
      const actual = parse(initial)

      const expected = {
        items: [
          {
            items: [],
            title: 'Toolbar'
          },
          {
            href: 'https://developer.mozilla.org/ru/',
            title: 'MDN Web Docs'
          },
          {
            items: [
              {
                href: 'https://tc39.es/',
                title: 'TC39 - Specifying JavaScript.'
              },
              {
                items: [
                  {
                    href: 'https://v8.dev/',
                    title: 'V8 JavaScript engine'
                  },
                  {
                    href: 'https://spidermonkey.dev/',
                    title: 'Home | SpiderMonkey JavaScript/WebAssembly Engine'
                  }
                ],
                title: 'Engines'
              },
              {
                items: [
                  {
                    description:
                      "Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
                    href: 'https://nodejs.org/en',
                    title: 'Node.js — Run JavaScript Everywhere'
                  },
                  {
                    description:
                      "Deno features improved security, performance, and developer experience compared to its predecessor. It's a great time to upgrade your Node.js project to run on Deno.",
                    href: 'https://deno.com/',
                    title: 'Deno, the next-generation JavaScript runtime'
                  }
                ],
                title: 'Runtimes'
              }
            ],
            title: 'JavaScript'
          },
          {
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
            id: '0.0',
            items: [],
            pid: '0',
            title: 'Toolbar'
          },
          {
            href: 'https://developer.mozilla.org/ru/',
            id: '0.1',
            pid: '0',
            title: 'MDN Web Docs'
          },
          {
            id: '0.2',
            items: [
              {
                href: 'https://tc39.es/',
                id: '0.2.0',
                pid: '0.2',
                title: 'TC39 - Specifying JavaScript.'
              },
              {
                id: '0.2.1',
                items: [
                  {
                    href: 'https://v8.dev/',
                    id: '0.2.1.0',
                    pid: '0.2.1',
                    title: 'V8 JavaScript engine'
                  },
                  {
                    href: 'https://spidermonkey.dev/',
                    id: '0.2.1.1',
                    pid: '0.2.1',
                    title: 'Home | SpiderMonkey JavaScript/WebAssembly Engine'
                  }
                ],
                pid: '0.2',
                title: 'Engines'
              },
              {
                id: '0.2.2',
                items: [
                  {
                    description:
                      "Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
                    href: 'https://nodejs.org/en',
                    id: '0.2.2.0',
                    pid: '0.2.2',
                    title: 'Node.js — Run JavaScript Everywhere'
                  },
                  {
                    description:
                      "Deno features improved security, performance, and developer experience compared to its predecessor. It's a great time to upgrade your Node.js project to run on Deno.",
                    href: 'https://deno.com/',
                    id: '0.2.2.1',
                    pid: '0.2.2',
                    title: 'Deno, the next-generation JavaScript runtime'
                  }
                ],
                pid: '0.2',
                title: 'Runtimes'
              }
            ],
            pid: '0',
            title: 'JavaScript'
          },
          {
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
