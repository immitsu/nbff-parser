export default [
  {
    import: {
      'index.js': '{ customParse }'
    },
    limit: '280',
    name: 'customParse'
  },
  {
    import: {
      'index.js': '{ flatStringify }'
    },
    limit: '925 B',
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
    limit: '1.7 kB',
    name: 'merge'
  },
  {
    limit: '2.1 kB',
    name: 'all',
    path: 'index.js'
  }
]
