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
      'index.js': '{ stringify }'
    },
    limit: '625 B',
    name: 'stringify'
  },
  {
    limit: '1251 kB',
    name: 'all',
    path: 'index.js'
  }
]
