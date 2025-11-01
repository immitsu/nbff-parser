export const traverse = (txt, fns) => {
  const l = txt.length

  let i = 0
  let c = 0

  const substrUntil = (a, b) => {
    const s = ++i
    while (txt[i] !== a && txt[i] !== b) i++
    return txt.slice(s, i)
  }

  const substrTag = () => substrUntil('>', ' ').toLowerCase()

  while (i++ < l) {
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
        c += 1
      }
    }

    // If it's a closing tag.
    else if (txt[i] === '/' && txt[i - 1] === '<') {
      if (substrTag() === 'dl') {
        fns.closeFolder()
        c -= 1
      }
    }
  }

  // For incomplete structure.
  while (c--) fns.closeFolder()
}
