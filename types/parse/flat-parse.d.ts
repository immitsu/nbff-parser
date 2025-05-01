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
export function flatParse(
  text: string,
  options?: Partial<{
    excludeAttrs: AllAttrKeys[]
    withId: false
  }>
): FlatBookmark[]
export function flatParse(
  text: string,
  options: {
    excludeAttrs?: AllAttrKeys[]
    withId: true
  }
): FlatBookmarkWithId[]
