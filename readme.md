# nbff-parser

A simple parser for the Netscape Bookmark file format, which is generated when exporting bookmarks from a browser. It can output data in several formats, including customizable one, and convert parsed data back into an HTML string.

- **Small**. Between 0.3 and 1.58 kB (minified and brotlied). No dependencies. It uses [Size Limit](https://github.com/ai/size-limit) to control size.
- **ES modules** and **tree shaking** support.
- **TypeScript** support.

<br/>

The Netscape Bookmark file format does not have an official standard, which requires to collect disparate information for type definitions. The information appears to have been compiled in this [article](https://github.com/FlyingWolFox/Netscape-Bookmarks-File-Parser/wiki/Netscape-Bookmarks-File-Format) from a similar Python project.

The parser expects the HTML file content to be provided as a string.

Attribute names are returned as is, but converted to lowercase. Attribute values are returned slightly modified.

## Install

```sh
npm i nbff-parser
```

## API

### `parse`

[Type definition](./types/parse.d.ts)

Returns bookmarks in a tree-like format, as they were in the file.

```js
import { parse } from 'nbff-parser'

const bookmarks = parse(html)
```

<details>
<summary>Result schema</summary>

```json
[
  {
    "title": "Folder",
    "items": [
      {
        "title": "Bookmark"
      },
      {
        "title": "Nested Folder",
        "items": [
          {
            "title": "Another Bookmark"
          }
        ]
      }
    ]
  }
]
```

</details>

#### `options`

##### `excludeAttrs: string[]`

Removes the specified attributes from the final data to reduce its size. For instance, the `ICON`-attribute, typically represented as a string encoded in PNG/Base64, can consume a significant amount of space.

##### `withId: boolean`

Adds `id` and `pid` to the bookmark object. These properties represent the path to the object.

```js
import { parse } from 'nbff-parser'

const bookmarks = parse(html, { withId: true })
```

<details>
<summary>Result schema</summary>

```json
[
  {
    "id": "0",
    "title": "Folder",
    "items": [
      {
        "id": "0.0",
        "pid": "0",
        "title": "Bookmark"
      },
      {
        "id": "0.1",
        "pid": "0",
        "title": "Nested Folder",
        "items": [
          {
            "id": "0.1.0",
            "pid": "0.1",
            "title": "Another Bookmark"
          }
        ]
      }
    ]
  }
]
```

</details>
<br/>

### `flatParse`

[Type definition](./types/flat-parse.d.ts)

Returns a flat list of bookmarks, with each bookmark including a folder stack to indicate its location. Empty folders will not be included in the final data.

```js
import { flatParse } from 'nbff-parser'

const bookmarks = flatParse(html)
```

<details>
<summary>Result schema</summary>

```json
[
  {
    "title": "Bookmark",
    "folder": [
      {
        "title": "Folder"
      }
    ]
  },
  {
    "title": "Another Bookmark",
    "folder": [
      {
        "title": "Folder"
      },
      {
        "title": "Nested Folder"
      }
    ]
  }
]
```

</details>

#### `options`

##### `excludeAttrs: string[]`

Removes the specified attributes from the final data to reduce its size. For instance, the `ICON`-attribute, typically represented as a string encoded in PNG/Base64, can consume a significant amount of space.

##### `withId: boolean`

Adds `id` to the bookmark object. This property is an incrementally increasing number.

```js
import { flatParse } from 'nbff-parser'

const bookmarks = flatParse(html, { withId: true })
```

<details>
<summary>Result schema</summary>

```json
[
  {
    "id": 1,
    "title": "Bookmark",
    "folder": [
      {
        "id": 0,
        "title": "Folder"
      }
    ]
  },
  {
    "id": 4,
    "title": "Another Bookmark",
    "folder": [
      {
        "id": 2,
        "title": "Folder"
      }
      {
        "id": 3,
        "title": "Nested Folder",
      },
    ]
  }
]
```

</details>
<br/>

### `customParse`

[Type definition](./types/custom-parse.d.ts)

Processes the input and triggers the appropriate handler when it encounters an attributed tag.

This parser variant can be used to develop custom logic or structures. The methods described above rely on it internally.

Required handlers:

- `addBookmark`
- `addBookmarkDescription`
- `openFolder`
- `closeFolder`

```js
import { customParse } from 'nbff-parser'

const handlers = {
  addBookmark,
  addBookmarkDescription,
  openFolder,
  closeFolder
}

const bookmarks = customParse(html, handlers)
```

<br/>

### `stringify`

[Type definition](./types/stringify.d.ts)

Converts the data obtained from the `parse` call back to an HTML string.

```js
import { parse, stringify } from 'nbff-parser'

const html = '...'
const parsed = parse(html)

const backToHtml = stringify(parsed[0])
// `html` and `backToHtml` are identical
```

<br/>

### `flatStringify`

[Type definition](./types/flat-stringify.d.ts)

Converts the data obtained from the `flatParse` call back to an HTML string.

We need to pass `{ withId: true }` to `flatParse` so that each folder has a unique identifier. In a hierarchical structure, the element’s position within the hierarchy would serve as its identifier.

```js
import { flatParse, flatStringify } from 'nbff-parser'

const html = '...'
const parsed = flatParse(html, { withId: true })

const backToHtml = flatStringify(parsed)
// `html` and `backToHtml` are identical
```
