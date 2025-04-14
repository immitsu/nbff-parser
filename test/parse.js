import { deepEqual } from 'node:assert'
import { describe, test } from 'node:test'

import { parse } from '../index.js'

describe('parse', () => {
  describe('bookmark format ', () => {
    const text = `
      <A HREF="https://www.wikipedia.org" ADD_DATE="1739910037" LAST_MODIFIED="1739910038" LAST_VISIT="1739910039" ICON="data:image/png;base64,..." ICON_URI="" PRIVATE="0" TAGS="edu,wikipedia" SHORTCUTURL="wikipedia" WEBSLICE="false" PREVIEWSIZE="10 x 10" ISLIVEPREVIEW="false" WEBSLICE="false" FEED="false" FEEDURL="">Wikipedia&nbsp;— The Free Encyclopedia</A>
    `

    const processed = {
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
      const result = parse(text)
      const expect = [processed]

      deepEqual(result, expect)
    })

    test('with id', () => {
      const result = parse(text, { withId: true })
      const expect = [{ ...processed, id: '0' }]

      deepEqual(result, expect)
    })

    test('lower case', () => {
      const lower = `
        <a href="https://www.wikipedia.org" add_date="1739910037" last_modified="1739910038" last_visit="1739910039" icon="data:image/png;base64,..." icon_uri="" private="0" tags="edu,wikipedia" shortcuturl="wikipedia" webslice="false" previewsize="10 x 10" islivepreview="false" webslice="false" feed="false" feedurl="">Wikipedia&nbsp;— The Free Encyclopedia</a>
      `

      const result = parse(lower)
      const expect = [processed]

      deepEqual(result, expect)
    })
  })

  describe('folder format', () => {
    const text = `
      <DT><H3 ADD_DATE="1739910037" LAST_MODIFIED="1739910038" PERSONAL_TOOLBAR_FOLDER="false" UNFILED_BOOKMARKS_FOLDER="false">JavaScript</H3>
      <DL><p>
      </DL><p>
    `

    const processed = {
      add_date: 1739910037000,
      items: [],
      last_modified: 1739910038000,
      personal_toolbar_folder: false,
      title: 'JavaScript',
      unfiled_bookmarks_folder: false
    }

    test('default', () => {
      const result = parse(text)
      const expect = [processed]

      deepEqual(result, expect)
    })

    test('with id', () => {
      const result = parse(text, { withId: true })
      const expect = [{ ...processed, id: '0' }]

      deepEqual(result, expect)
    })
  })

  describe('nested folders', () => {
    const text = `
      <!DOCTYPE NETSCAPE-Bookmark-file-1>
      <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
      <!-- This is an automatically generated file.
      It will be read and overwritten.
      Do Not Edit! -->
      <TITLE>Bookmarks</TITLE>
      <H1>Bookmarks</H1>
      <DL><p>
        <DT><A HREF="https://developer.mozilla.org">MDN Web Docs</A>
        <DD>The MDN Web Docs site provides information about Open Web technologies including HTML, CSS, and APIs for both Web sites and progressive web apps.
        <DT><H3 PERSONAL_TOOLBAR_FOLDER="false">JavaScript</H3>
        <DL><p>
          <DT><A HREF="https://tc39.es">TC39 - Specifying JavaScript.</A>
          <DT><H3>Engines</H3>
          <DL><p>
            <DT><A HREF="https://v8.dev">V8</A>
            <DT><A HREF="https://spidermonkey.dev">SpiderMonkey</A>
            <DT><A HREF="https://developer.apple.com/documentation/javascriptcore">JavaScriptCore</A>
          </DL><p>
          <DT><H3>Runtimes</H3>
          <DL><p>
            <DT><A HREF="https://nodejs.org">Node.js — Run JavaScript Everywhere</A>
            <DD>Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
            <DT><A HREF="https://deno.com">Deno, the next-generation JavaScript runtime</A>
            <DD>Deno features improved security, performance, and developer experience compared to its predecessor. It's a great time to upgrade your Node.js project to run on Deno.
            <DT><A HREF="https://bun.sh">Bun — A fast all-in-one JavaScript runtime</A>
            <DD>Bundle, install, and run JavaScript & TypeScript — all in Bun. Bun is a new JavaScript runtime with a native bundler, transpiler, task runner, and npm client built-in.
          </DL><p>
        </DL><p>
        <DT><H3>CSS</H3>
        <DL><p>
        </DL><p>
      </DL><p>
    `

    test('regular', () => {
      const result = parse(text)

      const expect = [
        {
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
      ]

      deepEqual(result, expect)
    })

    test('with id', () => {
      const result = parse(text, { withId: true })

      const expect = [
        {
          id: '0',
          items: [
            {
              description:
                'The MDN Web Docs site provides information about Open Web technologies including HTML, CSS, and APIs for both Web sites and progressive web apps.',
              href: 'https://developer.mozilla.org',
              id: '0.0',
              pid: '0',
              title: 'MDN Web Docs'
            },
            {
              id: '0.1',
              items: [
                {
                  href: 'https://tc39.es',
                  id: '0.1.0',
                  pid: '0.1',
                  title: 'TC39 - Specifying JavaScript.'
                },
                {
                  id: '0.1.1',
                  items: [
                    {
                      href: 'https://v8.dev',
                      id: '0.1.1.0',
                      pid: '0.1.1',
                      title: 'V8'
                    },
                    {
                      href: 'https://spidermonkey.dev',
                      id: '0.1.1.1',
                      pid: '0.1.1',
                      title: 'SpiderMonkey'
                    },
                    {
                      href: 'https://developer.apple.com/documentation/javascriptcore',
                      id: '0.1.1.2',
                      pid: '0.1.1',
                      title: 'JavaScriptCore'
                    }
                  ],
                  pid: '0.1',
                  title: 'Engines'
                },
                {
                  id: '0.1.2',
                  items: [
                    {
                      description:
                        "Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
                      href: 'https://nodejs.org',
                      id: '0.1.2.0',
                      pid: '0.1.2',
                      title: 'Node.js — Run JavaScript Everywhere'
                    },
                    {
                      description:
                        "Deno features improved security, performance, and developer experience compared to its predecessor. It's a great time to upgrade your Node.js project to run on Deno.",
                      href: 'https://deno.com',
                      id: '0.1.2.1',
                      pid: '0.1.2',
                      title: 'Deno, the next-generation JavaScript runtime'
                    },
                    {
                      description:
                        'Bundle, install, and run JavaScript & TypeScript — all in Bun. Bun is a new JavaScript runtime with a native bundler, transpiler, task runner, and npm client built-in.',
                      href: 'https://bun.sh',
                      id: '0.1.2.2',
                      pid: '0.1.2',
                      title: 'Bun — A fast all-in-one JavaScript runtime'
                    }
                  ],
                  pid: '0.1',
                  title: 'Runtimes'
                }
              ],
              personal_toolbar_folder: false,
              pid: '0',
              title: 'JavaScript'
            },
            {
              id: '0.2',
              items: [],
              pid: '0',
              title: 'CSS'
            }
          ],
          title: 'Bookmarks'
        }
      ]

      deepEqual(result, expect)
    })
  })
})
