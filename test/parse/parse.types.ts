import { Bookmark, BookmarkWithId, Folder, FolderWithId, parse } from '../../index.js'

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

const folderWithId: Required<FolderWithId> = {
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

const parser = parse('..')
parser satisfies Folder

const parserWithId = parse('..', { withId: true })
parserWithId satisfies Folder
parserWithId satisfies FolderWithId

const parserWithTransform = parse('..', {
  transform: item => {
    if (!item.href) return
    return ({ name: item.title, url: item.href })
  }
})
parserWithTransform satisfies Folder<{ name: string, url: string }>

const parserWithIdent = parse('..', { transform: item => item })
parserWithIdent satisfies Folder

const parserWithIdAndIdent = parse('..', { withId: true, transform: item => item })
parserWithIdAndIdent satisfies Folder
parserWithIdAndIdent satisfies FolderWithId
