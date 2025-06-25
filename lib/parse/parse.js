import { mixinAttrs, setExcludedAttrs } from './attrs.js'
import { traverse } from './traverse.js'

const itemEnhancer = opts => {
  const excludedAttrs = setExcludedAttrs(opts.excludeAttrs)

  const mixinId = (item, folder) => {
    if (folder) {
      const { id, items } = folder
      item.pid = id
      item.id = `${id}.${items.length}`
    } else {
      item.id = '0'
    }
  }

  return (item, attrs, folder) => {
    mixinAttrs(item, attrs, excludedAttrs)
    opts.withId && mixinId(item, folder)
    return item
  }
}

const treeBuilder = ({ end, enhance }) => {
  const foldersStack = []
  let currFolder

  return {
    addBookmark: (title, attrs) => {
      const bookmark = enhance({ title }, attrs, currFolder)
      currFolder.items.push(bookmark)
    },
    closeFolder: () => {
      const folder = foldersStack.pop()
      currFolder = foldersStack.at(-1)
      if (currFolder) {
        currFolder.items.push(folder)
      } else {
        end(folder)
      }
    },
    describeBookmark: description => {
      const bookmark = currFolder.items.at(-1)
      bookmark.description = description
    },
    openFolder: (title, attrs) => {
      const folder = enhance({ items: [], title }, attrs, currFolder)
      currFolder = folder
      foldersStack.push(folder)
    }
  }
}

export const parse = (txt, opts = {}) => {
  let folder
  const end = f => (folder = f)
  const enhance = itemEnhancer(opts)
  const handlers = treeBuilder({ end, enhance })
  traverse(txt, handlers)
  if (folder) return folder
  throw new Error('Parsing did not produce a root folder')
}
