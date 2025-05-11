export const traverse = (txt, fns) => {
  const len = txt.length

  let i = 0

  const substrUntil = (a, b) => {
    const start = ++i
    while (txt[i] !== a && txt[i] !== b) i++
    return txt.slice(start, i)
  }

  const substrTag = () => substrUntil('>', ' ').toLowerCase()

  while (i++ < len) {
    // If it's an opening tag.
    if (txt[i] === '<' && txt[i + 1] !== '/') {
      const tag = substrTag()

      if (tag === 'dd') {
        const description = substrUntil('<')
        fns.describeBookmark(description.trim())
        continue
      }

      if (!'ah3h1'.includes(tag)) continue

      // Collect attributes.
      const attrs = {}
      while (txt[i] !== '>') {
        const attr = substrUntil('=')
        const quote = txt[++i] // Skip '='.
        const val = substrUntil(quote)
        attrs[attr.toLowerCase()] = val
        i++ // Skip closing quote.
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
