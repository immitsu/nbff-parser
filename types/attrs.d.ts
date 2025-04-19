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
