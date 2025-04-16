import type { Bookmark, Folder, AllAttrKeys } from './parse.d.ts'

type FlatFolder = Omit<Folder, 'items'>

export type FlatBookmark = Bookmark & {
  folder: FlatFolder[]
}

export type ReturnFlatParse = FlatBookmark[]

type WithId<T> = T & { id: number }

export type FlatBookmarkWithId = WithId<
  FlatBookmark & { folder: WithId<FlatFolder>[] }
>

export type ReturnFlatParseWithId = FlatBookmarkWithId[]

// Overload signatures.
export function flatParse(
  text: string,
  options?: Partial<{
    excludeAttrs: AllAttrKeys[]
    withId: false
  }>
): ReturnFlatParse
export function flatParse(
  text: string,
  options: {
    excludeAttrs?: AllAttrKeys[]
    withId: true
  }
): ReturnFlatParseWithId
