import { Bookmark, BookmarkWithId, Folder, FolderWithId, parse } from '../../index.js'

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
  previewsize: { w: 10, h: 10 }
}

bookmark satisfies Required<Bookmark>

const bookmarkWithId = {
  ...bookmark,
  pid: '0',
  id: '0.0'
}

bookmarkWithId satisfies Required<BookmarkWithId>

const folder = {
  add_date: 1739910037000,
  last_modified: 1739910038000,
  title: 'Wiki',
  items: [
    {
      title: 'Article'
    },
    {
      title: 'Nested folder',
      items: []
    }
  ],
  personal_toolbar_folder: false,
  unfiled_bookmarks_folder: false
}

folder satisfies Required<Folder>

const folderWithId = {
  ...folder,
  items: [
    {
      title: 'Article',
      pid: '0.0',
      id: '0.0.0'
    },
    {
      title: 'Nested folder',
      pid: '0.0',
      id: '0.0.1',
      items: []
    }
  ],
  pid: '0',
  id: '0.0'
}

folderWithId satisfies Required<FolderWithId>

parse('') satisfies Folder

parse('', { withId: true }) satisfies FolderWithId

parse('', {
  transform: ({ href }) => href ? { url: href } : undefined
}) satisfies Folder<{ url: string }>

parse('', { transform: item => item }) satisfies Folder

parse('', { withId: true, transform: item => item }) satisfies FolderWithId

parse('', { noEmpty: true }) satisfies Folder
