import { traverse } from './traverse.js'
import { ident, mixinAttrs, mixinHierarchicalId, noop } from './utils.js'

const enhancer = opts => {
  const applyAttrs = mixinAttrs(opts.excludeAttrs)
  const applyId = opts.withId ? mixinHierarchicalId : noop

  return (item, attrs, folder) => {
    applyAttrs(item, attrs)
    applyId(item, folder)
    return item
  }
}

const createParser = opts => {
  const foldersStack = []
  let currentFolder

  const enhance = enhancer(opts)
  const transform = opts.transform || ident

  return {
    addBookmark: (title, attrs) => {
      const bookmark = enhance({ title }, attrs, currentFolder)
      const transformed = transform(bookmark)
      transformed && currentFolder.items.push(transformed)
    },

    closeFolder: () => {
      const closed = foldersStack.pop()
      currentFolder = foldersStack.at(-1)

      if (currentFolder) {
        if (opts.noEmpty && !closed.items.length) return
        currentFolder.items.push(closed)
      } else {
        currentFolder = closed
      }
    },

    describeBookmark: description => {
      const bookmark = currentFolder.items.at(-1)
      bookmark.description = description
    },

    getState: () => currentFolder,

    openFolder: (title, attrs) => {
      const opened = enhance({ items: [], title }, attrs, currentFolder)
      currentFolder = opened
      foldersStack.push(currentFolder)
    }
  }
}

export const parse = (txt, opts = {}) => {
  const parser = createParser(opts)
  traverse(txt, parser)
  const folder = parser.getState()
  if (folder) return folder
  throw new Error('Parsing did not produce a root folder')
}
