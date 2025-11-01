import { stringify } from './stringify.js'

const mapFolders = bookmarks => {
  const map = new Map()

  const mapFolder = ({ id, ...rest }) => {
    if (id === undefined) {
      throw new Error('Folder must have a unique identifier')
    }

    if (!map.has(id)) {
      map.set(id, {
        ...rest,
        children: new Set([]),
        id,
        items: []
      })
    }

    return map.get(id)
  }

  for (let i = 0; i < bookmarks.length; i++) {
    const { folder: folderStack, ...bookmark } = bookmarks[i]

    const currFolder = mapFolder(folderStack.at(-1))
    currFolder.items.push(bookmark)

    for (let j = 0; j < folderStack.length - 1; j++) {
      const folder = mapFolder(folderStack[j])
      folder.children.add(folderStack[j + 1].id)
    }
  }

  return map
}

const createRootFolder = bookmarks => {
  const folders = mapFolders(bookmarks)

  const transformFolder = ({ children, ...folder }) => {
    if (!children.size) return folder

    children.forEach(id => {
      const child = folders.get(id)
      const transformed = transformFolder(child)
      folder.items.push(transformed)
    })

    folder.items.sort((a, b) => a.id - b.id)

    return folder
  }

  const rootId = bookmarks[0].folder[0].id
  const rootFolder = folders.get(rootId)

  return transformFolder(rootFolder)
}

export const flatStringify = bookmarks => {
  const folder = bookmarks.length
    ? createRootFolder(bookmarks)
    : { items: [], title: 'Bookmarks' }

  return stringify(folder)
}
