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
    limit: '1.51 kB',
    name: 'all',
    path: 'index.js'
  }
]
