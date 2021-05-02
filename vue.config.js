module.exports = {
  lintOnSave: false,
  configureWebpack: {
    resolve: {
      symlinks: false
    }
  },
  transpileDependencies: [
    'vuetify'
  ]
}
