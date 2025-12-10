import { traverse } from '../parse/traverse.js'
import { mixinAttrs } from '../parse/utils.js'
import { flatStringify } from '../stringify/flat-stringify.js'

const mergeId = () => {
  let rootId = ''
  let mainId = ''

  const idPartLengths = []

  return {
    addPart(part) {
      if (!rootId) {
        rootId = part
        mainId = rootId
      } else if (!idPartLengths.length) {
        mainId = rootId
        idPartLengths.push(mainId.length)
        return
      } else {
        mainId += part
      }
      idPartLengths.push(part.length)
    },

    removePart() {
      if (idPartLengths.length) {
        mainId = mainId.slice(0, -idPartLengths.pop())
      }
    },

    get value() {
      return mainId
    }
  }
}

const foldersCollector = () => {
  const id = mergeId()
  const stack = []

  let currentFolder
  const updateCurrentFolder = () => {
    currentFolder = stack.slice()
  }

  return {
    close() {
      id.removePart()
      stack.pop()
      updateCurrentFolder()
    },

    getState() {
      return {
        folder: currentFolder,
        id: id.value
      }
    },

    open(folder) {
      id.addPart(folder.title)
      folder.id = id.value
      stack.push(folder)
      updateCurrentFolder()
    }
  }
}

const bookmarksCollector = () => {
  const store = new Map()

  const deepenStoreKey = k => k + '_'

  let descriptionDraft = null

  return {
    add(bookmark) {
      let key = bookmark.title + bookmark.id

      if (store.has(key)) {
        const duplicate = store.get(key)

        if (duplicate.href === bookmark.href) {
          descriptionDraft = { bookmark, duplicate, key }
          return
        }

        key = deepenStoreKey(key)
      }

      store.set(key, bookmark)
      descriptionDraft = { bookmark, duplicate: null, key }
    },

    describe(description) {
      if (!descriptionDraft) return

      const { bookmark, duplicate, key } = descriptionDraft

      if (!duplicate) {
        store.get(key).description = description
      } else if (!duplicate.description) {
        duplicate.description = description
      } else if (duplicate.description !== description) {
        bookmark.description = description
        store.set(deepenStoreKey(key), bookmark)
      }

      descriptionDraft = null
    },

    get values() {
      return Array.from(store.values())
    }
  }
}

const createParser = () => {
  const folders = foldersCollector()
  const bookmarks = bookmarksCollector()

  const applyAttrs = mixinAttrs()

  return {
    addBookmark(title, attrs) {
      const { folder, id } = folders.getState()
      const bookmark = { folder, id, title }
      applyAttrs(bookmark, attrs)
      bookmarks.add(bookmark)
    },

    closeFolder: folders.close,

    describeBookmark: bookmarks.describe,

    openFolder(title, attrs) {
      const folder = { title }
      applyAttrs(folder, attrs)
      folders.open(folder)
    },

    get result() {
      return bookmarks.values
    }
  }
}

export const merge = (...texts) => {
  const parser = createParser()
  texts.forEach(text => traverse(text, parser))
  return flatStringify(parser.result)
}
