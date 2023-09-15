export default {
  server: {
    proxy: {
      '/pokemon': 'http://localhost:3000'
    },
  },
}
