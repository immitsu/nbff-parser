const TAG_BOUND = '> \n\r'
const HEADERS = 'h1h3'
const ATTRIBUTED = 'a' + HEADERS

export const traverse = (txt, fns) => {
  const len = txt.length

  let idx = 0

  const substr = cb => {
    const start = ++idx
    while (idx < len && cb(txt[idx])) idx++
    return txt.slice(start, idx)
  }

  const substrTag = () => substr(s => !TAG_BOUND.includes(s)).toLowerCase()

  while (idx++ < len) {
    // If it's an opening tag.
    if (txt[idx] === '<' && txt[idx + 1] !== '/') {
      const tag = substrTag()

      if (tag === 'dd') {
        const description = substr(s => s !== '<')
        fns.addBookmarkDescription(description.trim())
        continue
      }

      if (!ATTRIBUTED.includes(tag)) continue

      // Collect attributes.
      const attrs = {}
      while (txt[idx] !== '>') {
        const attr = substr(s => s !== '=')

        const quote = txt[++idx] // Skip '='.
        if (quote === '"' || quote === "'") {
          const value = substr(s => s !== quote)
          idx++ // Skip closing quote.
          attrs[attr.toLowerCase()] = value
        }
      }

      const textContent = substr(s => s !== '<')

      if (HEADERS.includes(tag)) {
        fns.openFolder(textContent, attrs)
      } else {
        fns.addBookmark(textContent, attrs)
      }
    }

    // If it's a closing tag.
    else if (txt[idx] === '/' && txt[idx - 1] === '<') {
      const tag = substrTag()

      tag === 'dl' && fns.closeFolder()
    }
  }
}
