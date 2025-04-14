import type { Bookmark, Folder, AllAttrKeys } from './parse.d.ts'

export type FlatBookmark = Bookmark & {
  folder: Omit<Folder, 'items'>[]
}

export type FlatBookmarks = FlatBookmark[]

export function flatParse(
  text: string,
  options?: { excludeAttrs: AllAttrKeys[] }
): FlatBookmarks
