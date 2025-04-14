import type { Bookmark, Folder } from './parse.d.ts'

export type FlatBookmark = Bookmark & {
  folder: Omit<Folder, 'items'>[]
}

export type FlatBookmarks = FlatBookmark[]

export function flatParse(text: string): FlatBookmarks
