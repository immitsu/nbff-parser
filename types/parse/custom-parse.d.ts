import type { BookmarkAttrs, FolderAttrs } from '../attrs.d.ts'

interface Handlers {
  addBookmark: (title: string, attrs: BookmarkAttrs) => void
  describeBookmark: (description: string) => void
  closeFolder: () => void
  openFolder: (title: string, attrs: FolderAttrs) => void
}

export function customParse<T>(text: string, handlers: Handlers): T
