export default [
  {
    import: {
      'index.js': '{ customParse }'
    },
    limit: '260 B',
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
    import: {
      'index.js': '{ merge }'
    },
    limit: '1.63 kB',
    name: 'merge'
  },
  {
    limit: '2 kB',
    name: 'all',
    path: 'index.js'
  }
]
