# nbff-parser

A simple parser for the Netscape Bookmark file format, which is generated when exporting bookmarks from a browser. It can output data in several formats, including customizable one.

- **Small**. Between 305 and 736 bytes (minified and brotlied). No dependencies. It uses [Size Limit](https://github.com/ai/size-limit) to control size.
- **ES modules** and **tree shaking** support.
- **TypeScript** support.

---

## Install

```sh
npm i nbff-parser
```

## API

### `parse`

Returns bookmarks in a tree-like format.

```js
import { parse } from 'nbff-parser'

const bookmarks = parse(html)
```

[Type definition](./types/parse.d.ts)

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
<br/>

Also you can add `id` and `pid` to the bookmark object by enabling the corresponding option. These properties represent the path to the object.

```js
import { parse } from 'nbff-parser'

const bookmarks = parse(html, { withId: true })
```

[Type definition](./types/parse.d.ts)

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

### `flatParse`

Returns a flat list of bookmarks, with each bookmark including a folder stack to indicate its location.

```js
import { flatParse } from 'nbff-parser'

const bookmarks = flatParse(html)
```

[Type definition](./types/flat-parse.d.ts)

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
      }
      {
        "title": "Nested Folder",
      },
    ]
  }
]
```

</details>

### `customParse`

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

[Type definition](./types/custom-parse.d.ts)

## Notice

The Netscape Bookmark file format does not have an official standard, which requires to collect disparate information for type definitions. The information appears to have been compiled in this [article](https://github.com/FlyingWolFox/Netscape-Bookmarks-File-Parser/wiki/Netscape-Bookmarks-File-Format) from a similar Python project.

The parser expects the HTML file content to be provided as a string.

Attribute names are returned as is, but converted to lowercase.<br/>Attribute values are returned slightly modified.
