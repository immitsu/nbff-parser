import type { BookmarkAttrs, FolderAttrs } from './parse.js'

interface Handlers {
  addBookmark: (title: string, attrs: BookmarkAttrs) => void
  addBookmarkDescription: (description: string) => void
  closeFolder: () => void
  openFolder: (title: string, attrs: FolderAttrs) => void
}

export function customParse<T>(text: string, handlers: Handlers): T
