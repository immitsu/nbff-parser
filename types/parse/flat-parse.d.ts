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

type TransformFn<I, R> = (item: I) => R | null | undefined

// Overload signatures.
export function flatParse<T = FlatBookmark>(
  text: string,
  options?: Partial<{
    excludeAttrs: AllAttrKeys[]
    withId: false
    transform: TransformFn<FlatBookmark, T>
  }>
): NonNullable<T>[]
export function flatParse<T = FlatBookmarkWithId>(
  text: string,
  options: {
    excludeAttrs?: AllAttrKeys[]
    withId: true
    transform?: TransformFn<FlatBookmarkWithId, T>
  }
): NonNullable<T>[]
