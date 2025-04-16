import { deepEqual } from 'node:assert'
import { describe, test } from 'node:test'

import { parse, stringify } from '../index.js'

describe('stringify', () => {
  describe('correct format', () => {
    test('bookmark', () => {
      const folder = {
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

      const text = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<!-- This is an automatically generated file.
It will be read and overwritten.
Do Not Edit! -->
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
  <DT><A ADD_DATE="1739910037" FEED="false" FEEDURL="" HREF="https://www.wikipedia.org" ICON="data:image/png;base64,..." ICON_URI="" ISLIVEPREVIEW="false" LAST_MODIFIED="1739910038" LAST_VISIT="1739910039" PREVIEWSIZE="10 x 10" PRIVATE="0" SHORTCUTURL="wikipedia" TAGS="edu,wikipedia" WEBSLICE="false">Wikipedia&nbsp;— The Free Encyclopedia</A>
</DL><p>
`

      const result = stringify(folder)

      deepEqual(result, text)
    })

    test('folder', () => {
      const folder = {
        items: [
          {
            add_date: 1739910037000,
            items: [],
            last_modified: 1739910038000,
            personal_toolbar_folder: false,
            title: 'JavaScript',
            unfiled_bookmarks_folder: false
          }
        ],
        title: 'Bookmarks'
      }

      const text = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<!-- This is an automatically generated file.
It will be read and overwritten.
Do Not Edit! -->
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
  <DT><H3 ADD_DATE="1739910037" LAST_MODIFIED="1739910038" PERSONAL_TOOLBAR_FOLDER="false" UNFILED_BOOKMARKS_FOLDER="false">JavaScript</H3>
  <DL><p>
  </DL><p>
</DL><p>
`

      const result = stringify(folder)

      deepEqual(result, text)
    })
  })

  describe('nested folders', () => {
    const folder = {
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
          // personal_toolbar_folder: false, TBD
          title: 'JavaScript'
        },
        {
          items: [],
          title: 'CSS'
        }
      ],
      title: 'Bookmarks'
    }

    const text = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<!-- This is an automatically generated file.
It will be read and overwritten.
Do Not Edit! -->
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
  <DT><A HREF="https://developer.mozilla.org">MDN Web Docs</A>
  <DD>The MDN Web Docs site provides information about Open Web technologies including HTML, CSS, and APIs for both Web sites and progressive web apps.
  <DT><H3>JavaScript</H3>
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

    test('stringify', () => {
      const result = stringify(folder)

      deepEqual(result, text)
    })

    test('stringify after parse', () => {
      const parsed = parse(text)
      const stringified = stringify(parsed[0])

      deepEqual(text, stringified)
    })
  })
})
