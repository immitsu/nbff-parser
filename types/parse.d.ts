export type BookmarkAttrs = Partial<{
  add_date: number
  feed: boolean
  feedurl: string
  href: string
  icon_uri: string
  icon: string
  islivepreview: boolean
  last_modified: number
  last_visit: number
  previewsize: { h: number; w: number }
  private: boolean
  shortcuturl: string
  tags: string[]
  webslice: boolean
}>

export type FolderAttrs = Partial<{
  add_date: number
  last_modified: number
  personal_toolbar_folder: boolean
  unfiled_bookmarks_folder: boolean
}>

export type AllAttrKeys = keyof (BookmarkAttrs & FolderAttrs)

export type Bookmark = BookmarkAttrs & {
  title: string
  description?: string
}

export type Folder = FolderAttrs & {
  title: string
  items: ReturnParse
}

export type ReturnParse = Array<Bookmark | Folder>

type WithId<T> = T & {
  id: string
  pid?: string
}

export type BookmarkWithId = WithId<Bookmark>

export type FolderWithId = WithId<Folder> & {
  items: ReturnParseWithId
}

export type ReturnParseWithId = Array<BookmarkWithId | FolderWithId>

// Overload signatures.
export function parse(
  text: string,
  options?: Partial<{
    excludeAttrs: AllAttrKeys[]
    withId: false
  }>
): ReturnParse
export function parse(
  text: string,
  options: {
    excludeAttrs?: AllAttrKeys[]
    withId: true
  }
): ReturnParseWithId
