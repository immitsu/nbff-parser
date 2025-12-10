import { joinAttrs, pad, template } from './utils.js'

const createItem = ({ description, id, items, pid, title, ...attrs }) => ({
  attrs: joinAttrs(attrs),
  description,
  title
})

const openFolder = (folder, lvl) => {
  const { attrs, title } = createItem(folder)
  const indent = pad(lvl)
  return `${indent}<DT><H3${attrs}>${title}</H3>\n${indent}<DL><p>\n`
}

const closeFolder = lvl => `${pad(lvl)}</DL><p>\n`

const addBookmark = (bookmark, lvl) => {
  const { attrs, description, title } = createItem(bookmark)
  const indent = pad(lvl)
  let result = `${indent}<DT><A${attrs}>${title}</A>\n`
  description && (result += `${indent}<DD>${description}\n`)
  return result
}

const createContent = items => {
  let res = ''

  const stack = []

  for (let idx = items.length - 1; idx >= 0; idx--) {
    stack.push({ item: items[idx], lvl: 0 })
  }

  while (stack.length) {
    const { item, lvl, out } = stack.pop()

    if (out) {
      res += closeFolder(lvl)
      continue
    }

    const lvlUp = lvl + 1

    if (Object.hasOwn(item, 'items')) {
      stack.push({ item, lvl: lvlUp, out: true })

      for (let idx = item.items.length - 1; idx >= 0; idx--) {
        stack.push({ item: item.items[idx], lvl: lvlUp })
      }

      res += openFolder(item, lvlUp)
    } else {
      res += addBookmark(item, lvlUp)
    }
  }

  return res
}

export const stringify = ({ items, title }) => {
  const content = createContent(items)
  return template(title, content)
}
