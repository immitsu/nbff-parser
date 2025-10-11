import { mixinAttrs, setExcludedAttrs } from './attrs.js'
import { traverse } from './traverse.js'

const itemEnhancer = opts => {
  const excludedAttrs = setExcludedAttrs(opts.excludeAttrs)

  let itemId = 0

  return (item, attrs) => {
    mixinAttrs(item, attrs, excludedAttrs)
    opts.withId && (item.id = itemId++)
    return item
  }
}

const bookmarksBuilder = ({ add, describe, enhance, transform }) => {
  const foldersStack = []
  let currFolder

  return {
    addBookmark: (title, attrs) => {
      const bookmark = enhance({ folder: currFolder, title }, attrs)
      add(transform(bookmark))
    },
    closeFolder: () => {
      foldersStack.pop()
      currFolder = foldersStack.slice()
    },
    describeBookmark: describe,
    openFolder: (title, attrs) => {
      const folder = enhance({ title }, attrs)
      foldersStack.push(folder)
      currFolder = foldersStack.slice()
    }
  }
}

export const flatParse = (txt, opts = {}) => {
  const bookmarks = []
  const add = b => bookmarks.push(b)
  const describe = d => (bookmarks.at(-1).description = d)
  const enhance = itemEnhancer(opts)
  const transform = opts.transform || (x => x)
  const handlers = bookmarksBuilder({ add, describe, enhance, transform })
  traverse(txt, handlers)
  return bookmarks
}
