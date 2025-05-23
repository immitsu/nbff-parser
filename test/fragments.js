export const empty = `
  <H1>Bookmarks</H1>
  <DL><p>
  </DL><p>
`

const bookmark = `<DT><A ADD_DATE="1739910037" FEED="false" FEEDURL="" HREF="https://www.wikipedia.org" ICON="data:image/png;base64,..." ICON_URI="" ISLIVEPREVIEW="false" LAST_MODIFIED="1739910038" LAST_VISIT="1739910039" PREVIEWSIZE="10 x 10" PRIVATE="0" SHORTCUTURL="wikipedia" TAGS="edu,wikipedia" WEBSLICE="false">Wikipedia&nbsp;— The Free Encyclopedia</A>`

export const nested = `
  <DT><H3 ADD_DATE="1739910037" LAST_MODIFIED="1739910038" PERSONAL_TOOLBAR_FOLDER="false" UNFILED_BOOKMARKS_FOLDER="true">Edu</H3>
  <DL><p>
      ${bookmark}
  </DL><p>
`

export const root = `
  <H1>Bookmarks</H1>
  <DL><p>
      ${bookmark}
  </DL><p>
`

export const template = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
    ${bookmark}
</DL><p>
`
