import { traverse } from '../parse/traverse.js'
import { mixinAttrs } from '../parse/utils.js'
import { flatStringify } from '../stringify/flat-stringify.js'

const createCompositeId = () => {
  let rootId = ''
  let currentId = ''

  const segments = []

  return {
    addSegment(segment) {
      if (!rootId) {
        currentId = segment
        rootId = currentId
      } else if (!segments.length) {
        currentId = rootId
        segments.push(currentId.length)
        return
      } else {
        currentId += segment
      }
      segments.push(segment.length)
    },

    removeSegment() {
      if (segments.length < 1) return
      currentId = currentId.slice(0, -segments.pop())
    },

    get value() {
      return currentId
    }
  }
}

const createFoldersCollector = () => {
  const id = createCompositeId()
  const stack = []

  let currentPath = []

  return {
    close() {
      id.removeSegment()
      stack.pop()
      currentPath = stack.slice()
    },

    get currentId() {
      return id.value
    },

    get currentPath() {
      return currentPath
    },

    open(folder) {
      id.addSegment(folder.title)
      folder.id = id.value
      stack.push(folder)
      currentPath = stack.slice()
    }
  }
}

const createBookmarksCollector = () => {
  const store = new Map()
  let pending = null

  const extendKey = k => k + '_'

  return {
    add(bookmark) {
      let key = bookmark.title + bookmark.id

      if (store.has(key)) {
        const existingBookmark = store.get(key)

        if (existingBookmark.href === bookmark.href) {
          pending = { bookmark, duplicate: existingBookmark, key }
          return
        }

        key = extendKey(key)
      }

      store.set(key, bookmark)
      pending = { bookmark, duplicate: null, key }
    },

    get bookmarks() {
      return Array.from(store.values())
    },

    describe(description) {
      if (!pending) return

      const { bookmark, duplicate, key } = pending

      if (!duplicate) {
        store.get(key).description = description
      } else if (!duplicate.description) {
        duplicate.description = description
      } else if (duplicate.description !== description) {
        bookmark.description = description
        store.set(extendKey(key), bookmark)
      }

      pending = null
    }
  }
}

const createParser = () => {
  const foldersCollector = createFoldersCollector()
  const bookmarksCollector = createBookmarksCollector()

  const applyAttrs = mixinAttrs()

  return {
    addBookmark(title, attrs) {
      const { currentId: id, currentPath: folder } = foldersCollector
      const bookmark = { folder, id, title }
      applyAttrs(bookmark, attrs)
      bookmarksCollector.add(bookmark)
    },

    closeFolder: foldersCollector.close,

    describeBookmark: bookmarksCollector.describe,

    openFolder(title, attrs) {
      const folder = { title }
      applyAttrs(folder, attrs)
      foldersCollector.open(folder)
    },

    get result() {
      return bookmarksCollector.bookmarks
    }
  }
}

export const merge = (...texts) => {
  const parser = createParser()
  texts.forEach(text => traverse(text, parser))
  return flatStringify(parser.result)
}
