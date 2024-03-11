const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
  // ...其它配置
  entry: './src/index.js',  //入口文件
  optimization: {
    minimize: false,
    // splitChunks: {
    //   cacheGroups: {
    //     default: false,
    //     defaultVendors: false,
    //     'clg': {
    //       test: /clg/,
    //       priority: 30,
    //       chunks: 'all',
    //       name: 'clg',
    //     },
    //   },
    // }
  },
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html', // 指定HTML模板文件路径
      filename: 'index.html', // 指定输出的HTML文件名
    }),
    // 开启 BundleAnalyzerPlugin
    new BundleAnalyzerPlugin({ analyzerPort: '9999', openAnalyzer: false}),
  ],
  output: {
    filename: 'index.js',  //输出文件名
    path:path.resolve(__dirname,'./dist') //指定生成的文件目录
  },
}
