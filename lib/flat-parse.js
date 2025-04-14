import { assignAttrs, prepareExcludedAttrs } from './assign-attrs.js'
import { traverse } from './traverse.js'

export const flatParse = (text, opts = {}) => {
  const bookmarks = []
  const folders = []

  let currFolder = []

  const excludedAttrs = prepareExcludedAttrs(opts.excludeAttrs)

  const setupItem = (item, attrs) => assignAttrs(item, attrs, excludedAttrs)

  const handlers = {
    addBookmark: (title, attrs) => {
      const bookmark = setupItem({ folder: currFolder, title }, attrs)
      bookmarks.push(bookmark)
    },

    addBookmarkDescription: description => {
      bookmarks.length && (bookmarks.at(-1).description = description)
    },

    closeFolder: () => {
      folders.pop()
      currFolder = folders.slice()
    },

    openFolder: (title, attrs) => {
      const folder = setupItem({ title }, attrs)
      folders.push(folder)
      currFolder = folders.slice()
    }
  }

  traverse(text, handlers)

  return bookmarks
}
