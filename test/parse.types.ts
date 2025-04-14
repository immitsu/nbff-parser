import { Bookmark, BookmarkWithId, Folder, FolderWithId } from '../index.js'

// We check the relevance of types here via `pnpm test:types`.

const bookmark: Required<Bookmark> = {
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

const bookmarkWithId: Required<BookmarkWithId> = {
  ...bookmark,
  pid: '0',
  id: '0.0'
}

const folder: Required<Folder> = {
  add_date: 1739910037000,
  last_modified: 1739910038000,
  title: 'Wiki',
  items: [],
  personal_toolbar_folder: false,
  unfiled_bookmarks_folder: false
}

const folderWithId: Required<FolderWithId> = {
  ...folder,
  items: [],
  pid: '0',
  id: '0.0'
}
