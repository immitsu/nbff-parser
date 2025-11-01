export const template = (title, content) => `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>${title}</H1>
<DL><p>\n${content}</DL><p>\n`

const INDENT = '    '
export const pad = lvl => INDENT.repeat(lvl)

const parseAttr = (name, val) => {
  switch (name) {
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
    const val = parseAttr(attr, attrs[attr])
    return res + ` ${attr.toUpperCase()}="${val}"`
  }, '')
