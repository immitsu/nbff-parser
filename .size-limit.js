export default [
  {
    import: {
      'index.js': '{ customParse }'
    },
    limit: '270 B',
    name: 'customParse'
  },
  {
    import: {
      'index.js': '{ flatStringify }'
    },
    limit: '911 B',
    name: 'flatStringify'
  },
  {
    import: {
      'index.js': '{ stringify }'
    },
    limit: '626 B',
    name: 'stringify'
  },
  {
    limit: '1.5 kB',
    name: 'all',
    path: 'index.js'
  }
]
