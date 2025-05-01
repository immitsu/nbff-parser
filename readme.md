# nbff-parser

A simple parser for the Netscape Bookmark File Format (NBFF), commonly generated when exporting bookmarks from browsers. It supports parsing bookmarks into various formats — including customizable structures — and converting parsed data back into HTML.

## Features

- **Small**: 0.3 to 1.5 kB (minified + brotlied), no dependencies. It uses [Size Limit](https://github.com/ai/size-limit) to control size.
- **Modern**: Supports ES modules and tree shaking.
- **TypeScript ready**: Full type definitions included.

## Install

```sh
npm i nbff-parser
```

## API

The parser expects HTML-file content to be provided as a string.

### `parse`

[Type definition](./types/parse/parse.d.ts)

Parses bookmarks into a nested tree structure.

```js
import { parse } from 'nbff-parser'

const bookmarks = parse(html)
```

<details>
<summary>Result schema</summary>

```json
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
```

</details>

#### `options`

##### `excludeAttrs: string[]`

Exclude specified attributes from output (e.g., `ICON` to reduce size).

##### `withId: boolean`

Adds hierarchical identifiers `id` and `pid` to each item.

```js
const bookmarks = parse(html, { withId: true })
```

<details>
<summary>Result schema</summary>

```json
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
```

</details>

### `flatParse`

[Type definition](./types/parse/flat-parse.d.ts)

Parses bookmarks into a flat list, where each bookmark includes a folder stack representing its location path. Empty folders are omitted.

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

Exclude specified attributes from output (e.g., `ICON` to reduce size).

##### `withId: boolean`

Adds incremental numeric `id` to items.

```js
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
    "id": 3,
    "title": "Another Bookmark",
    "folder": [
      {
        "id": 0,
        "title": "Folder"
      }
      {
        "id": 2,
        "title": "Nested Folder",
      },
    ]
  }
]
```

</details>

### `customParse`

[Type definition](./types/parse/custom-parse.d.ts)

Provides fine-grained control by allowing you to define handlers for bookmark elements during parsing.

Use this to build custom data structures or implement custom logic.

The methods described above rely on it internally.

Required handlers:

- `addBookmark`
- `describeBookmark`
- `openFolder`
- `closeFolder`

```js
import { customParse } from 'nbff-parser'

const handlers = {
  addBookmark,
  describeBookmark,
  openFolder,
  closeFolder
}

const bookmarks = customParse(html, handlers)
```

### `stringify`

[Type definition](./types/stringify/stringify.d.ts)

Converts the parsed tree structure (from `parse`) back into an HTML string.

```js
import { parse, stringify } from 'nbff-parser'

const parsed = parse(html)
const stringified = stringify(parsed)
// `stringified` matches the original `html`
```

### `flatStringify`

[Type definition](./types/stringify/flat-stringify.d.ts)

Converts the flat list (from `flatParse`) back into an HTML string.

> It requires using `flatParse` with `{ withId: true }` to ensure unique item IDs.

```js
import { flatParse, flatStringify } from 'nbff-parser'

const parsed = flatParse(html, { withId: true })
const stringified = flatStringify(parsed)
// `stringified` matches the original `html`
```

## Attribute Handling

- Attribute names are returned lowercased.
- Attribute values may be slightly normalized.
- See detailed attribute types [here](./types/attrs.d.ts).

## Acknowledgments

- [Netscape Bookmark File Format Wiki](https://github.com/FlyingWolFox/Netscape-Bookmarks-File-Parser/wiki/Netscape-Bookmarks-File-Format) for the collected info about NBFF.
