import { FlatBookmark, FlatBookmarkWithId, flatParse } from '../../index.js'

// We check the relevance of types here via `pnpm test:types`.

const bookmark: Required<FlatBookmark> = {
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

const bookmarkWithId: Required<FlatBookmarkWithId> = {
  ...bookmark,
  folder: [
    {
      title: 'Bookmark',
      id: 1
    }
  ],
  id: 0
}

const parser = flatParse('..')
parser satisfies FlatBookmark[]

const parserWithId = flatParse('..', { withId: true })
parserWithId satisfies FlatBookmark[]
parserWithId satisfies FlatBookmarkWithId[]

const parserWithTransform = flatParse('..', {
  transform: item => {
    if (!item.href) return
    return ({ name: item.title, url: item.href })
  }
})
parserWithTransform satisfies { name: string, url: string }[]

const parserWithIdent = flatParse('..', { transform: item => item })
parserWithIdent satisfies FlatBookmark[]

const parserWithIdAndIdent = flatParse('..', { withId: true, transform: item => item })
parserWithIdAndIdent satisfies FlatBookmark[]
parserWithIdAndIdent satisfies FlatBookmarkWithId[]
