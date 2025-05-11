import { mixinAttrs, prepareExcludedAttrs } from './attrs.js'
import { traverse } from './traverse.js'

export const parse = (text, opts = {}) => {
  let currFolder, rootFolder

  const folders = []

  const excludedAttrs = prepareExcludedAttrs(opts.excludeAttrs)

  const mixinId = item => {
    if (currFolder) {
      const { id, items } = currFolder
      item.pid = id
      item.id = `${id}.${items.length}`
    } else {
      item.id = '0'
    }
  }

  const setupItem = (item, attrs) => {
    mixinAttrs(item, attrs, excludedAttrs)
    opts.withId && mixinId(item)
    return item
  }

  const handlers = {
    addBookmark: (title, attrs) => {
      const bookmark = setupItem({ title }, attrs)
      currFolder.items.push(bookmark)
    },

    closeFolder: () => {
      const folder = folders.pop()
      currFolder = folders.at(-1)
      if (currFolder) {
        currFolder.items.push(folder)
      } else {
        rootFolder = folder
      }
    },

    describeBookmark: description => {
      const bookmark = currFolder.items.at(-1)
      bookmark.description = description
    },

    openFolder: (title, attrs) => {
      const folder = setupItem({ items: [], title }, attrs)
      currFolder = folder
      folders.push(folder)
    }
  }

  traverse(text, handlers)

  return rootFolder
}
