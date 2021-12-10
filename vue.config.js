module.exports = {
  assetsDir: 'static',
  devServer: {
    proxy: {
      '/videoanalysis/api': {
        target: 'http://192.168.1.220:8080',
        changeOrigin: true
      }
    }
  }
}
