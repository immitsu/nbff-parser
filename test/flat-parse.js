import { deepEqual } from 'node:assert'
import { describe, test } from 'node:test'

import { flatParse } from '../index.js'

describe('flat-parse', () => {
  describe('bookmark format', () => {
    const text = `
      <A HREF="https://www.wikipedia.org" ADD_DATE="1739910038" LAST_MODIFIED="1739910039" ICON="data:image/png;base64,..." PRIVATE="0" TAGS="edu,wiki">Wikipedia&nbsp;— The Free Encyclopedia</A>
    `

    const processed = {
      add_date: 1739910038000,
      folder: [],
      href: 'https://www.wikipedia.org',
      icon: 'data:image/png;base64,...',
      last_modified: 1739910039000,
      private: false,
      tags: ['edu', 'wiki'],
      title: 'Wikipedia&nbsp;— The Free Encyclopedia'
    }

    test('default', () => {
      const result = flatParse(text)
      const expect = [processed]

      deepEqual(result, expect)
    })

    test('with excluded attrs', () => {
      const result = flatParse(text, {
        excludeAttrs: ['icon', 'TAGS']
      })
      // eslint-disable-next-line no-unused-vars
      const { icon, tags, ...rest } = processed
      const expect = [rest]

      deepEqual(result, expect)
    })
  })

  describe('folder format', () => {
    const text = `
      <DT><H3 ADD_DATE="1739910037" LAST_MODIFIED="1739910038" PERSONAL_TOOLBAR_FOLDER="false">Edu</H3>
      <DL><p>
        <DT><A HREF="https://www.wikipedia.org">Wikipedia&nbsp;— The Free Encyclopedia</A>
      </DL><p>
    `

    const processed = {
      folder: [
        {
          add_date: 1739910037000,
          last_modified: 1739910038000,
          personal_toolbar_folder: false,
          title: 'Edu'
        }
      ],
      href: 'https://www.wikipedia.org',
      title: 'Wikipedia&nbsp;— The Free Encyclopedia'
    }

    test('regular', () => {
      const result = flatParse(text)
      const expect = [processed]

      deepEqual(result, expect)
    })

    test('with id', () => {
      const result = flatParse(text, { withId: true })
      const expect = [
        {
          ...processed,
          folder: [
            {
              ...processed.folder[0],
              id: 0
            }
          ],
          id: 1
        }
      ]

      deepEqual(result, expect)
    })

    test('with excluded attrs', () => {
      const result = flatParse(text, {
        excludeAttrs: ['add_date', 'last_modified', 'personal_toolbar_folder']
      })

      const expect = [
        {
          folder: [{ title: 'Edu' }],
          href: 'https://www.wikipedia.org',
          title: 'Wikipedia&nbsp;— The Free Encyclopedia'
        }
      ]

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
        <DT><H3>JavaScript</H3>
        <DL><p>
          <DT><H3>Runtimes</H3>
          <DL><p>
            <DT><A HREF="https://nodejs.org">Node.js — Run JavaScript Everywhere</A>
            <DD>Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
            <DT><A HREF="https://deno.com">Deno, the next-generation JavaScript runtime</A>
            <DD>Deno features improved security, performance, and developer experience compared to its predecessor. It's a great time to upgrade your Node.js project to run on Deno.
            <DT><A HREF="https://bun.sh">Bun — A fast all-in-one JavaScript runtime</A>
            <DD>Bundle, install, and run JavaScript & TypeScript — all in Bun. Bun is a new JavaScript runtime with a native bundler, transpiler, task runner, and npm client built-in.
          </DL><p>
          <DT><A HREF="https://tc39.es">TC39 - Specifying JavaScript.</A>
        </DL><p>
      </DL><p>
    `

    test('regular', () => {
      const result = flatParse(text)

      const expect = [
        {
          description:
            'The MDN Web Docs site provides information about Open Web technologies including HTML, CSS, and APIs for both Web sites and progressive web apps.',
          folder: [
            {
              title: 'Bookmarks'
            }
          ],
          href: 'https://developer.mozilla.org',
          title: 'MDN Web Docs'
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
          href: 'https://nodejs.org',
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
          href: 'https://deno.com',
          title: 'Deno, the next-generation JavaScript runtime'
        },
        {
          description:
            'Bundle, install, and run JavaScript & TypeScript — all in Bun. Bun is a new JavaScript runtime with a native bundler, transpiler, task runner, and npm client built-in.',
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
          href: 'https://bun.sh',
          title: 'Bun — A fast all-in-one JavaScript runtime'
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
          href: 'https://tc39.es',
          title: 'TC39 - Specifying JavaScript.'
        }
      ]

      deepEqual(result, expect)
    })

    test('with id', () => {
      const result = flatParse(text, { withId: true })

      const expect = [
        {
          description:
            'The MDN Web Docs site provides information about Open Web technologies including HTML, CSS, and APIs for both Web sites and progressive web apps.',
          folder: [
            {
              id: 0,
              title: 'Bookmarks'
            }
          ],
          href: 'https://developer.mozilla.org',
          id: 1,
          title: 'MDN Web Docs'
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
              id: 2,
              title: 'JavaScript'
            },
            {
              id: 3,
              title: 'Runtimes'
            }
          ],
          href: 'https://nodejs.org',
          id: 4,
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
              id: 2,
              title: 'JavaScript'
            },
            {
              id: 3,
              title: 'Runtimes'
            }
          ],
          href: 'https://deno.com',
          id: 5,
          title: 'Deno, the next-generation JavaScript runtime'
        },
        {
          description:
            'Bundle, install, and run JavaScript & TypeScript — all in Bun. Bun is a new JavaScript runtime with a native bundler, transpiler, task runner, and npm client built-in.',
          folder: [
            {
              id: 0,
              title: 'Bookmarks'
            },
            {
              id: 2,
              title: 'JavaScript'
            },
            {
              id: 3,
              title: 'Runtimes'
            }
          ],
          href: 'https://bun.sh',
          id: 6,
          title: 'Bun — A fast all-in-one JavaScript runtime'
        },
        {
          folder: [
            {
              id: 0,
              title: 'Bookmarks'
            },
            {
              id: 2,
              title: 'JavaScript'
            }
          ],
          href: 'https://tc39.es',
          id: 7,
          title: 'TC39 - Specifying JavaScript.'
        }
      ]

      deepEqual(result, expect)
    })
  })
})
