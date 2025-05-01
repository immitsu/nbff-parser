export const traverse = (txt, fns) => {
  const len = txt.length

  let i = 0

  const substrUntil = ch => {
    const start = ++i
    while (i < len && !ch.includes(txt[i])) i++
    return txt.slice(start, i)
  }

  const substrTag = () => substrUntil('>\n\r ').toLowerCase()

  while (i++ < len) {
    // If it's an opening tag.
    if (txt[i] === '<' && txt[i + 1] !== '/') {
      const tag = substrTag()

      if (tag === 'dd') {
        const description = substrUntil('<')
        fns.describeBookmark(description.trim())
        continue
      }

      if (!'ah1h3'.includes(tag)) continue

      // Collect attributes.
      const attrs = {}
      while (txt[i] !== '>') {
        const attr = substrUntil('=')

        const quote = txt[++i] // Skip '='.
        if (quote === '"' || quote === "'") {
          const val = substrUntil(quote)
          i++ // Skip closing quote.
          attrs[attr.toLowerCase()] = val
        }
      }

      const textContent = substrUntil('<')

      if (tag === 'a') {
        fns.addBookmark(textContent, attrs)
      } else {
        fns.openFolder(textContent, attrs)
      }
    }

    // If it's a closing tag.
    else if (txt[i] === '/' && txt[i - 1] === '<') {
      substrTag() === 'dl' && fns.closeFolder()
    }
  }
}
