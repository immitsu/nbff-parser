import type { Bookmark, Folder } from './parse.d.ts'
import type { AllAttrKeys } from '../attrs.d.ts'

type FlatFolder = Omit<Folder, 'items'>

export type FlatBookmark = Bookmark & {
  folder: FlatFolder[]
}

type WithId<T> = T & { id: number }

export type FlatBookmarkWithId = WithId<
  Bookmark & {
    folder: WithId<FlatFolder>[]
  }
>

// Overload signatures.
export function flatParse<T = FlatBookmark>(
  text: string,
  options?: Partial<{
    excludeAttrs: AllAttrKeys[]
    withId: false
    transform: (item: FlatBookmark) => T
  }>
): T[]
export function flatParse<T = FlatBookmarkWithId>(
  text: string,
  options: {
    excludeAttrs?: AllAttrKeys[]
    withId: true
    transform?: (item: FlatBookmarkWithId) => T
  }
): T[]
