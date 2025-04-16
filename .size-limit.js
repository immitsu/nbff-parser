export default [
  {
    name: 'customParse',
    import: {
      'index.js': '{ customParse }'
    },
    limit: '305 B'
  },
  {
    name: 'stringify',
    import: {
      'index.js': '{ stringify }'
    },
    limit: '625 B'
  },
  {
    name: 'all',
    path: 'index.js',
    limit: '1251 kB'
  }
]
