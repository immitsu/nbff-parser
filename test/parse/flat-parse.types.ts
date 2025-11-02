import { FlatBookmark, FlatBookmarkWithId, flatParse } from '../../index.js'

// We check the relevance of types here via `pnpm test:types`.

const bookmark = {
  add_date: 1739910037000,
  last_modified: 1739910038000,
  last_visit: 1739910039000,
  icon: 'data:image/png;base64,...',
  private: false,
  title: 'Wikipedia&nbsp;— The Free Encyclopedia',
  href: 'https://www.wikipedia.org',
  tags: ['edu', 'wiki'],
  description: 'Wikipedia is a free online encyclopedia...',
  icon_uri: '',
  shortcuturl: 'wikipedia',
  feed: false,
  feedurl: '',
  webslice: false,
  islivepreview: false,
  previewsize: { w: 10, h: 10 },
  folder: [
    {
      title: 'Bookmark'
    },
    {
      title: 'edu',
      add_date: 1739910037000,
      last_modified: 1739910038000,
      personal_toolbar_folder: false
    },
    {
      title: 'wiki'
    }
  ]
}

bookmark satisfies Required<FlatBookmark>

const bookmarkWithId = {
  ...bookmark,
  folder: [
    {
      title: 'Bookmark',
      id: 1
    }
  ],
  id: 0
}

bookmarkWithId satisfies Required<FlatBookmarkWithId>

flatParse('') satisfies FlatBookmark[]

flatParse('', { withId: true }) satisfies FlatBookmarkWithId[]

flatParse('', {
  transform: ({ href }) => href ? { url: href } : undefined
}) satisfies { url: string }[]

flatParse('', { transform: item => item }) satisfies FlatBookmark[]

flatParse('', { withId: true, transform: item => item }) satisfies FlatBookmarkWithId[]
