module.exports = {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {
  },
  mini: {},
  h5: {
    /**
     * 如果h5端编译后体积过大，可以使用webpack-bundle-analyzer插件对打包体积进行分析。
     * 参考代码如下：
     * webpackChain (chain) {
     *   chain.plugin('analyzer')
     *     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
     * }
     */
  },
  rn: {
    output: {
      ios: 'dist/ios/CodePush/main.jsbundle',
      iosAssetsDest: 'dist/ios/CodePush',
      iosSourcemapOutput:'',
      android: 'dist/android/CodePush/index.android.bundle',
      androidAssetsDest: 'dist/android/CodePush',
      androidSourcemapOutput: ''
    },
  }
}
