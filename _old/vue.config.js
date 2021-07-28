const manifestJSON = require('./public/manifest.json')
module.exports = {
  lintOnSave: false,
  configureWebpack: {
    resolve: {
      symlinks: false
    }
  },
  transpileDependencies: [
    'vuetify'
  ],
  pwa: {
    themeColor: manifestJSON.theme_color,
    name: manifestJSON.short_name,
    msTileColor: manifestJSON.background_color,
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',    
    workboxOptions: {      
      runtimeCaching: [{
        urlPattern: new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
        handler: 'CacheFirst',
        options: {
          cacheName: '3d-score-google-fonts',
          expiration: {
            maxEntries: 30
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      }, {
        urlPattern: new RegExp('https://cdn.jsdelivr.net/(.*)'),
        handler: 'CacheFirst',
        options: {
          cacheName: '3d-score-jsdelivr',
          expiration: {
            maxEntries: 30
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      }]
    }
  }
}
