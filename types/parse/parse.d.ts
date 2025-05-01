import type { BookmarkAttrs, FolderAttrs, AllAttrKeys } from '../attrs.d.ts'

export type Bookmark = BookmarkAttrs & {
  title: string
  description?: string
}

export type Folder = FolderAttrs & {
  title: string
  items: (Folder | Bookmark)[]
}

type WithId<T> = T & {
  id: string
  pid?: string
}

export type BookmarkWithId = WithId<Bookmark>

export type FolderWithId = WithId<
  Omit<Folder, 'items'> & {
    items: (FolderWithId | BookmarkWithId)[]
  }
>

// Overload signatures.
export function parse(
  text: string,
  options?: Partial<{
    excludeAttrs: AllAttrKeys[]
    withId: false
  }>
): Folder
export function parse(
  text: string,
  options: {
    excludeAttrs?: AllAttrKeys[]
    withId: true
  }
): FolderWithId
