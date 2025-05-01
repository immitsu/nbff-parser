export default [
  {
    import: {
      'index.js': '{ customParse }'
    },
    limit: '309 B',
    name: 'customParse'
  },
  {
    import: {
      'index.js': '{ flatStringify }'
    },
    limit: '922 B',
    name: 'flatStringify'
  },
  {
    import: {
      'index.js': '{ stringify }'
    },
    limit: '634 B',
    name: 'stringify'
  },
  {
    limit: '1.59 kB',
    name: 'all',
    path: 'index.js'
  }
]
