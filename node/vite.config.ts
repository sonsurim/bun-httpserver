// vite.config.js
export default {
  server: {
    proxy: {
      '/pokemon': 'http://localhost:3000', // Express 서버의 주소로 프록시
    },
  },
}
