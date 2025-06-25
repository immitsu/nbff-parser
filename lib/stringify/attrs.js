const revalueAttr = (attr, val) => {
  switch (attr) {
    case 'add_date':
    case 'last_modified':
    case 'last_visit':
      return Math.floor(val / 1000) // Milliseconds to Unix time.
    case 'previewsize': {
      return `${val.w} x ${val.h}`
    }
    case 'private':
      return val ? '1' : '0'
    case 'tags':
      return val.join(',')
    default:
      return val
  }
}

export const joinAttrs = attrs =>
  Object.keys(attrs).reduce((res, attr) => {
    const val = revalueAttr(attr, attrs[attr])
    return res + ` ${attr.toUpperCase()}="${val}"`
  }, '')
