import { assignAttrs } from './assign-attrs.js'
import { traverse } from './traverse.js'

export const flatParse = text => {
  const bookmarks = []
  const folders = []

  let currFolder = []

  const handlers = {
    addBookmark: (title, attrs) => {
      const bookmark = { folder: currFolder, title }
      assignAttrs(bookmark, attrs)
      bookmarks.push(bookmark)
    },

    addBookmarkDescription: description => {
      bookmarks.length && (bookmarks.at(-1).description = description)
    },

    closeFolder: () => {
      folders.pop()
      currFolder = folders.slice()
    },

    openFolder: (title, attrs) => {
      const folder = { title }
      assignAttrs(folder, attrs)
      folders.push(folder)
      currFolder = folders.slice()
    }
  }

  traverse(text, handlers)

  return bookmarks
}
