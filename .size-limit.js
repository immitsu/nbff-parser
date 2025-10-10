export default [
  {
    import: {
      'index.js': '{ customParse }'
    },
    limit: '280 B',
    name: 'customParse'
  },
  {
    import: {
      'index.js': '{ flatStringify }'
    },
    limit: '905 B',
    name: 'flatStringify'
  },
  {
    import: {
      'index.js': '{ stringify }'
    },
    limit: '625 B',
    name: 'stringify'
  },
  {
    import: {
      'index.js': '{ merge }'
    },
    limit: '1.65 kB',
    name: 'merge'
  },
  {
    limit: '2.005 kB',
    name: 'all',
    path: 'index.js'
  }
]
