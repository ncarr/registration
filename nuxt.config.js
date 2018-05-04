module.exports = {
  modules: ['@nuxtjs/vuetify', '@nuxtjs/meta'],
  /*
  ** Add axios globally
  */
  plugins: ['~/plugins/axios'],
  build: {
    vendor: ['axios'],
    /*
    ** Run ESLINT on save
    */
    extend (config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
