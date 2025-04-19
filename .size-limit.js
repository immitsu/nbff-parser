export default [
  {
    import: {
      'index.js': '{ customParse }'
    },
    limit: '305 B',
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
    limit: '1.58 kB',
    name: 'all',
    path: 'index.js'
  }
]
