import { assignAttrs, prepareExcludedAttrs } from './assign-attrs.js'
import { traverse } from './traverse.js'

export const parse = (text, opts = {}) => {
  const bookmarks = []
  const folders = []

  let currFolder

  const getScope = () => (currFolder ? currFolder.items : bookmarks)

  const assignId = item => {
    if (currFolder) {
      item.pid = currFolder.id
      item.id = `${item.pid}.${currFolder.items.length}`
    } else {
      item.id = `${bookmarks.length}`
    }
  }

  const excludedAttrs = prepareExcludedAttrs(opts.excludeAttrs)

  const setupItem = (item, attrs) => {
    assignAttrs(item, attrs, excludedAttrs)
    opts.withId && assignId(item)
    return item
  }

  const handlers = {
    addBookmark: (title, attrs) => {
      const bookmark = setupItem({ title }, attrs)
      getScope().push(bookmark)
    },

    addBookmarkDescription: description => {
      const scope = getScope()
      scope.length && (scope.at(-1).description = description)
    },

    closeFolder: () => {
      if (!folders.length) return
      const folder = folders.pop()
      currFolder = folders.at(-1)
      getScope().push(folder)
    },

    openFolder: (title, attrs) => {
      const folder = setupItem({ items: [], title }, attrs)
      currFolder = folder
      folders.push(folder)
    }
  }

  traverse(text, handlers)

  return bookmarks
}
