import type { BookmarkAttrs, FolderAttrs, AllAttrKeys } from '../attrs.d.ts'

export type Bookmark = BookmarkAttrs & {
  title: string
  description?: string
}

export type Folder<T = Bookmark> = FolderAttrs & {
  title: string
  items: (Folder | T)[]
}

type WithId<T> = T & {
  id: string
  pid?: string
}

export type BookmarkWithId = WithId<Bookmark>

export type FolderWithId<T = BookmarkWithId> = WithId<
  Omit<Folder, 'items'> & {
    items: (FolderWithId | T)[]
  }
>

type Truthy<V> = V extends null | undefined | false | 0 | "" ? never : V

// Overload signatures.
export function parse<T = Bookmark>(
  text: string,
  options?: Partial<{
    excludeAttrs: AllAttrKeys[]
    withId: false
    transform: (bookmark: Bookmark) => T
    dropEmptyFolders: boolean
  }>
): Folder<Truthy<T>>
export function parse<T = BookmarkWithId>(
  text: string,
  options: {
    excludeAttrs?: AllAttrKeys[]
    withId: true
    transform?: (bookmark: BookmarkWithId) => T
    dropEmptyFolders?: boolean
  }
): FolderWithId<Truthy<T>>
