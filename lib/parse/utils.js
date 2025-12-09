export const ident = x => x

export const noop = () => {}

const parseAttr = (name, val) => {
  if (val === 'true') return true
  if (val === 'false') return false

  switch (name) {
    case 'add_date':
    case 'last_modified':
    case 'last_visit':
      return val * 1000 // Unix time to milliseconds.
    case 'previewsize': {
      const m = val.match(/\d+/g)
      if (m) return { h: +m[1], w: +m[0] }
      return { h: 10, w: 10 }
    }
    case 'private':
      return val !== '0'
    case 'tags':
      return val.split(',')
    default:
      return val
  }
}

export const mixinAttrs = (exclusions = []) => {
  const exclusionsSet = new Set(exclusions.map(attr => attr.toLowerCase()))

  return (item, attrs) => {
    for (const attr in attrs) {
      if (exclusionsSet.has(attr)) continue
      item[attr] = parseAttr(attr, attrs[attr])
    }
  }
}

export const mixinHierarchicalId = (item, folder) => {
  if (folder) {
    const { id, items } = folder
    item.pid = id
    item.id = `${id}.${items.length}`
  } else {
    item.id = '0'
  }
}

export const mixinNumericId = () => {
  let id = 0
  return item => (item.id = id++)
}
