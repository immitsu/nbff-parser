import { deepEqual } from 'node:assert'
import { describe, test } from 'node:test'

import { merge } from '../../lib/merge/merge.js'

describe('merge', () => {
  test('default', () => {
    const a = `
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
    <DT><A HREF="https://developer.mozilla.org/ru/" ADD_DATE="1745224163">MDN Web Docs</A>
    <DT><H3 ADD_DATE="1745224467" LAST_MODIFIED="1745224547">JavaScript</H3>
    <DL><p>
        <DT><A HREF="https://tc39.es/" ADD_DATE="1745224197">TC39 - Specifying JavaScript.</A>
        <DT><A HREF="https://developer.mozilla.org/ru/" ADD_DATE="1745224169">MDN Web Docs</A>
    </DL><p>
</DL><p>
`
    const b = `
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
    <DT><H3 ADD_DATE="1745224467" LAST_MODIFIED="1745224547">JavaScript</H3>
    <DL><p>
        <DT><H3 ADD_DATE="1745224489" LAST_MODIFIED="1745224528">Engines</H3>
        <DL><p>
            <DT><A HREF="https://v8.dev/" ADD_DATE="1745224509">V8 JavaScript engine</A>
            <DT><A HREF="https://spidermonkey.dev/" ADD_DATE="1745224509">Home | SpiderMonkey JavaScript/WebAssembly Engine</A>
        </DL><p>
    </DL><p>
</DL><p>
`

    const c = `
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
    <DT><H3 ADD_DATE="1745224467" LAST_MODIFIED="1745224547">JavaScript</H3>
    <DL><p>
        <DT><H3 ADD_DATE="1745224547" LAST_MODIFIED="1745224555">Runtimes</H3>
        <DL><p>
            <DT><A HREF="https://nodejs.org/en" ADD_DATE="1745224555">Node.js — Run JavaScript Everywhere</A>
            <DD>Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
            <DT><A HREF="https://deno.com/" ADD_DATE="1745224555">Deno, the next-generation JavaScript runtime</A>
            <DD>Deno features improved security, performance, and developer experience compared to its predecessor. It's a great time to upgrade your Node.js project to run on Deno.
        </DL><p>
    </DL><p>
    <DT><A HREF="https://en.wikipedia.org/wiki/Main_Page" ADD_DATE="1745224424">Wikipedia, the free encyclopedia</A>
</DL><p>
`

    const actual = merge(a, b, c)

    const expected1 = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
    <DT><A HREF="https://developer.mozilla.org/ru/" ADD_DATE="1745224163">MDN Web Docs</A>
    <DT><A HREF="https://en.wikipedia.org/wiki/Main_Page" ADD_DATE="1745224424">Wikipedia, the free encyclopedia</A>
    <DT><H3 ADD_DATE="1745224467" LAST_MODIFIED="1745224547">JavaScript</H3>
    <DL><p>
        <DT><A HREF="https://tc39.es/" ADD_DATE="1745224197">TC39 - Specifying JavaScript.</A>
        <DT><A HREF="https://developer.mozilla.org/ru/" ADD_DATE="1745224169">MDN Web Docs</A>
        <DT><H3 ADD_DATE="1745224489" LAST_MODIFIED="1745224528">Engines</H3>
        <DL><p>
            <DT><A HREF="https://v8.dev/" ADD_DATE="1745224509">V8 JavaScript engine</A>
            <DT><A HREF="https://spidermonkey.dev/" ADD_DATE="1745224509">Home | SpiderMonkey JavaScript/WebAssembly Engine</A>
        </DL><p>
        <DT><H3 ADD_DATE="1745224547" LAST_MODIFIED="1745224555">Runtimes</H3>
        <DL><p>
            <DT><A HREF="https://nodejs.org/en" ADD_DATE="1745224555">Node.js — Run JavaScript Everywhere</A>
            <DD>Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
            <DT><A HREF="https://deno.com/" ADD_DATE="1745224555">Deno, the next-generation JavaScript runtime</A>
            <DD>Deno features improved security, performance, and developer experience compared to its predecessor. It's a great time to upgrade your Node.js project to run on Deno.
        </DL><p>
    </DL><p>
</DL><p>
`

    deepEqual(actual, expected1)
  })

  describe('splice bookmarks', () => {
    test('identical', () => {
      const a = `
      <TITLE>Bookmarks</TITLE>
      <H1>Bookmarks</H1>
      <DL><p>
          <DT><A HREF="https://developer.mozilla.org/ru/" ADD_DATE="1745224163">MDN Web Docs</A>
      </DL><p>
      `
      const b = `
      <TITLE>Bookmarks</TITLE>
      <H1>Bookmarks</H1>
      <DL><p>
          <DT><A HREF="https://developer.mozilla.org/ru/" ADD_DATE="1745224163">MDN Web Docs</A>
      </DL><p>
      `

      const actual = merge(a, b)

      const expected1 = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
    <DT><A HREF="https://developer.mozilla.org/ru/" ADD_DATE="1745224163">MDN Web Docs</A>
</DL><p>
`

      deepEqual(actual, expected1)
    })

    test('with the same title but diff href', () => {
      const a = `
      <TITLE>Bookmarks</TITLE>
      <H1>Bookmarks</H1>
      <DL><p>
          <DT><A HREF="https://developer.mozilla.org" ADD_DATE="1745224163">MDN Web Docs</A>
      </DL><p>
      `
      const b = `
      <TITLE>Bookmarks</TITLE>
      <H1>Bookmarks</H1>
      <DL><p>
          <DT><A HREF="https://developer.mozilla.org/ru/" ADD_DATE="1745224163">MDN Web Docs</A>
      </DL><p>
      `

      const actual = merge(a, b)

      const expected1 = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
    <DT><A HREF="https://developer.mozilla.org" ADD_DATE="1745224163">MDN Web Docs</A>
    <DT><A HREF="https://developer.mozilla.org/ru/" ADD_DATE="1745224163">MDN Web Docs</A>
</DL><p>
`

      deepEqual(actual, expected1)
    })

    test('only first with description', () => {
      const a = `
        <TITLE>Bookmarks</TITLE>
        <H1>Bookmarks</H1>
        <DL><p>
            <DT><A HREF="https://developer.mozilla.org/ru/" ADD_DATE="1745224163">MDN Web Docs</A>
            <DD>Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
        </DL><p>
        `
      const b = `
        <TITLE>Bookmarks</TITLE>
        <H1>Bookmarks</H1>
        <DL><p>
            <DT><A HREF="https://developer.mozilla.org/ru/" ADD_DATE="1745224163">MDN Web Docs</A>
        </DL><p>
        `

      const actual = merge(a, b)

      const expected1 = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
    <DT><A HREF="https://developer.mozilla.org/ru/" ADD_DATE="1745224163">MDN Web Docs</A>
    <DD>Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
</DL><p>
`

      deepEqual(actual, expected1)
    })

    test('only second with description', () => {
      const a = `
        <TITLE>Bookmarks</TITLE>
        <H1>Bookmarks</H1>
        <DL><p>
            <DT><A HREF="https://developer.mozilla.org/ru/" ADD_DATE="1745224163">MDN Web Docs</A>
        </DL><p>
        `
      const b = `
        <TITLE>Bookmarks</TITLE>
        <H1>Bookmarks</H1>
        <DL><p>
            <DT><A HREF="https://developer.mozilla.org/ru/" ADD_DATE="1745224163">MDN Web Docs</A>
            <DD>Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
        </DL><p>
        `

      const actual = merge(a, b)

      const expected1 = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
    <DT><A HREF="https://developer.mozilla.org/ru/" ADD_DATE="1745224163">MDN Web Docs</A>
    <DD>Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
</DL><p>
`

      deepEqual(actual, expected1)
    })

    test('both with the same descriptions', () => {
      const a = `
        <TITLE>Bookmarks</TITLE>
        <H1>Bookmarks</H1>
        <DL><p>
            <DT><A HREF="https://developer.mozilla.org/ru/" ADD_DATE="1745224163">MDN Web Docs</A>
            <DD>Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
        </DL><p>
        `
      const b = `
        <TITLE>Bookmarks</TITLE>
        <H1>Bookmarks</H1>
        <DL><p>
            <DT><A HREF="https://developer.mozilla.org/ru/" ADD_DATE="1745224163">MDN Web Docs</A>
            <DD>Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
        </DL><p>
        `

      const actual = merge(a, b)

      const expected1 = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
    <DT><A HREF="https://developer.mozilla.org/ru/" ADD_DATE="1745224163">MDN Web Docs</A>
    <DD>Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
</DL><p>
`

      deepEqual(actual, expected1)
    })

    test('both with the different descriptions', () => {
      const a = `
        <TITLE>Bookmarks</TITLE>
        <H1>Bookmarks</H1>
        <DL><p>
            <DT><A HREF="https://developer.mozilla.org/ru/" ADD_DATE="1745224163">MDN Web Docs</A>
            <DD>Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
        </DL><p>
        `
      const b = `
        <TITLE>Bookmarks</TITLE>
        <H1>Bookmarks</H1>
        <DL><p>
            <DT><A HREF="https://developer.mozilla.org/ru/" ADD_DATE="1745224163">MDN Web Docs</A>
            <DD>MDN
        </DL><p>
        `

      const actual = merge(a, b)

      const expected1 = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
    <DT><A HREF="https://developer.mozilla.org/ru/" ADD_DATE="1745224163">MDN Web Docs</A>
    <DD>Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
    <DT><A HREF="https://developer.mozilla.org/ru/" ADD_DATE="1745224163">MDN Web Docs</A>
    <DD>MDN
</DL><p>
`

      deepEqual(actual, expected1)
    })
  })

  describe('splice folders', () => {
    test('with diff h1', () => {
      const a = `
      <TITLE>Bookmarks</TITLE>
      <H1>Bookmarksttt</H1>
      <DL><p>
          <DT><A HREF="https://developer.mozilla.org/ru/" ADD_DATE="1745224163">MDN Web Docs</A>
      </DL><p>
      `
      const b = `
      <TITLE>Bookmarks123</TITLE>
      <H1>Bookmarks123</H1>
      <DL><p>
          <DT><A HREF="https://developer.mozilla.org/ru/" ADD_DATE="1745224163">MDN Web Docs</A>
      </DL><p>
      `

      const actual = merge(a, b)

      const expected1 = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarksttt</H1>
<DL><p>
    <DT><A HREF="https://developer.mozilla.org/ru/" ADD_DATE="1745224163">MDN Web Docs</A>
</DL><p>
`

      deepEqual(actual, expected1)
    })

    test('nested folder', () => {
      const a = `
      <TITLE>Bookmarks</TITLE>
      <H1>Bookmarks</H1>
      <DL><p>
          <DT><A HREF="https://developer.mozilla.org/ru/" ADD_DATE="1745224163">MDN Web Docs</A>
          <DT><H3 ADD_DATE="1745224547" LAST_MODIFIED="1745224555">Runtimes</H3>
          <DL><p>
              <DT><A HREF="https://nodejs.org/en" ADD_DATE="1745224555">Node.js — Run JavaScript Everywhere</A>
              <DD>Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
          </DL><p>
      </DL><p>
      `
      const b = `
      <TITLE>Bookmarks</TITLE>
      <H1>Bookmarks</H1>
      <DL><p>
          <DT><A HREF="https://developer.mozilla.org/ru/" ADD_DATE="1745224163">MDN Web Docs</A>
          <DT><H3 ADD_DATE="1745224547" LAST_MODIFIED="1745224555">Runtimes</H3>
          <DL><p>
              <DT><A HREF="https://deno.com/" ADD_DATE="1745224555">Deno, the next-generation JavaScript runtime</A>
              <DD>Deno features improved security, performance, and developer experience compared to its predecessor. It's a great time to upgrade your Node.js project to run on Deno.
          </DL><p>
      </DL><p>
      `

      const actual = merge(a, b)

      const expected1 = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
    <DT><A HREF="https://developer.mozilla.org/ru/" ADD_DATE="1745224163">MDN Web Docs</A>
    <DT><H3 ADD_DATE="1745224547" LAST_MODIFIED="1745224555">Runtimes</H3>
    <DL><p>
        <DT><A HREF="https://nodejs.org/en" ADD_DATE="1745224555">Node.js — Run JavaScript Everywhere</A>
        <DD>Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
        <DT><A HREF="https://deno.com/" ADD_DATE="1745224555">Deno, the next-generation JavaScript runtime</A>
        <DD>Deno features improved security, performance, and developer experience compared to its predecessor. It's a great time to upgrade your Node.js project to run on Deno.
    </DL><p>
</DL><p>
`

      deepEqual(actual, expected1)
    })

    test('3 folders', () => {
      const a = `
      <TITLE>Bookmarks</TITLE>
      <H1>Bookmarks</H1>
      <DL><p>
          <DT><A HREF="https://developer.mozilla.org/ru/" ADD_DATE="1745224163">MDN Web Docs</A>
          <DT><H3 ADD_DATE="1745224547" LAST_MODIFIED="1745224555">Runtimes</H3>
          <DL><p>
              <DT><A HREF="https://nodejs.org/en" ADD_DATE="1745224555">Node.js — Run JavaScript Everywhere</A>
              <DD>Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
          </DL><p>
      </DL><p>
      `
      const b = `
      <TITLE>A6</TITLE>
      <H1>A6</H1>
      <DL><p>
          <DT><A HREF="https://developer.mozilla.org/ru/" ADD_DATE="1745224163">MDN Web Docs</A>
          <DT><H3 ADD_DATE="1745224547" LAST_MODIFIED="1745224555">Runtimes</H3>
          <DL><p>
              <DT><A HREF="https://deno.com/" ADD_DATE="1745224555">Deno, the next-generation JavaScript runtime</A>
              <DD>Deno features improved security, performance, and developer experience compared to its predecessor. It's a great time to upgrade your Node.js project to run on Deno.
          </DL><p>
      </DL><p>
      `

      const c = `
      <TITLE>A4</TITLE>
      <H1>A4</H1>
      <DL><p>
          <DT><A HREF="https://tc39.es/" ADD_DATE="1745224197">TC39 - Specifying JavaScript.</A>
          <DT><H3 ADD_DATE="1745224489" LAST_MODIFIED="1745224528">Engines</H3>
          <DL><p>
              <DT><A HREF="https://v8.dev/" ADD_DATE="1745224509">V8 JavaScript engine</A>
              <DT><A HREF="https://spidermonkey.dev/" ADD_DATE="1745224509">Home | SpiderMonkey JavaScript/WebAssembly Engine</A>
          </DL><p>
      </DL><p>
      `

      const actual = merge(a, b, c)

      const expected1 = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
    <DT><A HREF="https://developer.mozilla.org/ru/" ADD_DATE="1745224163">MDN Web Docs</A>
    <DT><A HREF="https://tc39.es/" ADD_DATE="1745224197">TC39 - Specifying JavaScript.</A>
    <DT><H3 ADD_DATE="1745224547" LAST_MODIFIED="1745224555">Runtimes</H3>
    <DL><p>
        <DT><A HREF="https://nodejs.org/en" ADD_DATE="1745224555">Node.js — Run JavaScript Everywhere</A>
        <DD>Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
        <DT><A HREF="https://deno.com/" ADD_DATE="1745224555">Deno, the next-generation JavaScript runtime</A>
        <DD>Deno features improved security, performance, and developer experience compared to its predecessor. It's a great time to upgrade your Node.js project to run on Deno.
    </DL><p>
    <DT><H3 ADD_DATE="1745224489" LAST_MODIFIED="1745224528">Engines</H3>
    <DL><p>
        <DT><A HREF="https://v8.dev/" ADD_DATE="1745224509">V8 JavaScript engine</A>
        <DT><A HREF="https://spidermonkey.dev/" ADD_DATE="1745224509">Home | SpiderMonkey JavaScript/WebAssembly Engine</A>
    </DL><p>
</DL><p>
`

      deepEqual(actual, expected1)
    })
  })
})
