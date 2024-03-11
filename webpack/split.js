module.exports = {
  chainWebpack(config) {
    config.when(process.env.NODE_ENV != 'development',
      config => {
        config.optimization.splitChunks({
          chunks: 'all',
          cacheGroups: {
            // 第三方组件
            libs: {
              ////指定chunks名称
              name: 'chunk-libs',
              //符合组的要求就给构建venders
              test: /[\\/]node_modules[\\/]/,
              //priority:优先级：数字越大优先级越高，因为默认值为0，所以自定义的一般是负数形式,决定cacheGroups中相同条件下每个组执行的优先顺序。
              priority: 10,
              // 仅限于最初依赖的第三方
              chunks: 'initial'
            },
            elementUI: {
              // 将elementUI拆分为单个包
              name: 'chunk-elementUI',
              // 重量需要大于libs和app，否则将打包到libs或app中
              priority: 20,
              // 为了适应cnpm
              test: /[\\/]node_modules[\\/]_?element-ui(.*)/
            },
            //公共组件
            commons: {
              name: 'chunk-commons',
              // can customize your rules
              test: resolve('src/components'),
              minChunks: 3,
              priority: 30,
              //这个的作用是当前的chunk如果包含了从main里面分离出来的模块，则重用这个模块，这样的问题是会影响chunk的名称。
              reuseExistingChunk: true,
              //最大初始化加载次数，一个入口文件可以并行加载的最大文件数量，默认3
              maxInitialRequests: 3,
              //表示在分离前的最小模块大小，默认为0，最小为30000
              minSize: 0
            },
            echarts: { // split echarts libs
              name: 'chunk-echarts',
              test: /[\\/]node_modules[\\/]_?echarts(.*)/,
              priority: 40,
              chunks: 'async',
              reuseExistingChunk: true
            },
            'utils': { // split utils libs
              name: 'chunk-utils',
              test: resolve('src/utils'),
              priority: 70,
              chunks: 'async',
              reuseExistingChunk: true
            },
          }
        })
      })
  }
}
