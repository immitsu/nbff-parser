import { mixinAttrs } from '../parse/attrs.js'
import { traverse } from '../parse/traverse.js'
import { flatStringify } from '../stringify/flat-stringify.js'

const idCombiner = () => {
  let rootId = ''
  let currId = ''
  const markers = []

  return {
    addPart(part) {
      if (!rootId) {
        currId = part
        rootId = currId
      } else if (!markers.length) {
        currId = rootId
        markers.push(currId.length)
        return
      } else {
        currId += part
      }
      markers.push(part.length)
    },
    removePart() {
      if (markers.length < 1) return
      currId = currId.slice(0, -markers.pop())
    },
    get value() {
      return currId
    }
  }
}

const foldersBuilder = () => {
  const folders = []

  let state = []
  const stateId = idCombiner()

  return {
    close() {
      stateId.removePart()
      folders.pop()
      state = folders.slice()
    },
    open(folder) {
      stateId.addPart(folder.title)
      folder.id = stateId.value
      folders.push(folder)
      state = folders.slice()
    },
    get state() {
      return state
    },
    get stateId() {
      return stateId.value
    }
  }
}

const bookmarksBuilder = () => {
  const store = new Map()
  let pending = null

  return {
    add(bookmark) {
      let key = bookmark.title + bookmark.id
      if (store.has(key)) {
        const existing = store.get(key)
        if (existing.href === bookmark.href) {
          pending = { bookmark, duplicate: existing, key }
          return
        }
        key += '_'
      }
      store.set(key, bookmark)
      pending = { bookmark, duplicate: null, key }
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
        store.set(key + '_', bookmark)
      }

      pending = null
    },
    get values() {
      return Array.from(store.values())
    }
  }
}

export const merge = (...texts) => {
  const folders = foldersBuilder()
  const bookmarks = bookmarksBuilder()

  const handlers = {
    addBookmark: (title, attrs) => {
      const { state, stateId } = folders
      const bookmark = { folder: state, id: stateId, title }
      mixinAttrs(bookmark, attrs)
      bookmarks.add(bookmark)
    },
    closeFolder: folders.close,
    describeBookmark: bookmarks.describe,
    openFolder: (title, attrs) => {
      const folder = { title }
      mixinAttrs(folder, attrs)
      folders.open(folder)
    }
  }

  texts.forEach(text => traverse(text, handlers))

  return flatStringify(bookmarks.values)
}
