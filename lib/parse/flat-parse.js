import { traverse } from './traverse.js'
import { ident, mixinAttrs, mixinNumericId, noop } from './utils.js'

const enhancer = opts => {
  const applyAttrs = mixinAttrs(opts.excludeAttrs)
  const applyId = opts.withId ? mixinNumericId() : noop

  return (item, attrs) => {
    applyAttrs(item, attrs)
    applyId(item)
    return item
  }
}

const createParser = opts => {
  const bookmarks = []

  const foldersStack = []
  let currentFolder

  const enhance = enhancer(opts)
  const transform = opts.transform || ident

  return {
    addBookmark: (title, attrs) => {
      const bookmark = enhance({ folder: currentFolder, title }, attrs)
      const transformed = transform(bookmark)
      transformed && bookmarks.push(transformed)
    },

    closeFolder: () => {
      foldersStack.pop()
      currentFolder = foldersStack.slice()
    },

    describeBookmark: description => {
      const bookmark = bookmarks.at(-1)
      bookmark.description = description
    },

    getState: () => bookmarks,

    openFolder: (title, attrs) => {
      const opened = enhance({ title }, attrs)
      foldersStack.push(opened)
      currentFolder = foldersStack.slice()
    }
  }
}

export const flatParse = (txt, opts = {}) => {
  const parser = createParser(opts)
  traverse(txt, parser)
  return parser.getState()
}
