const revalueAttr = (attr, val) => {
  if (val === 'true') return true
  if (val === 'false') return false

  switch (attr) {
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

export const prepareExcludedAttrs = attrs =>
  attrs && new Set(attrs.map(attr => attr.toLowerCase()))

export const mixinAttrs = (item, attrs, excluded) => {
  for (const attr in attrs) {
    if (excluded?.has(attr)) continue
    item[attr] = revalueAttr(attr, attrs[attr])
  }
}
