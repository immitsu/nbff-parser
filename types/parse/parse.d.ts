import type { BookmarkAttrs, FolderAttrs, AllAttrKeys } from '../attrs.d.ts'

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
