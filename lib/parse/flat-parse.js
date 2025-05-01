import { assignAttrs, prepareExcludedAttrs } from './attrs.js'
import { traverse } from './traverse.js'

export const flatParse = (text, opts = {}) => {
  const bookmarks = []
  const folders = []

  let currFolder = []
  let entityId = 0

  const excludedAttrs = prepareExcludedAttrs(opts.excludeAttrs)

  const setupItem = (item, attrs) => {
    assignAttrs(item, attrs, excludedAttrs)
    opts.withId && (item.id = entityId++)
    return item
  }

  const handlers = {
    addBookmark: (title, attrs) => {
      const bookmark = setupItem({ folder: currFolder, title }, attrs)
      bookmarks.push(bookmark)
    },

    closeFolder: () => {
      folders.pop()
      currFolder = folders.slice()
    },

    describeBookmark: description => {
      bookmarks.length && (bookmarks.at(-1).description = description)
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
