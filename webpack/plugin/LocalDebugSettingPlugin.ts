export default class LocalDebugSettingPlugin {
  local_debug: string | undefined;
  constructor({ userConfig }) {
    this.local_debug = process.env.LOCAL_DEBUG;
    this.userConfig = userConfig;
  }

  apply(compiler: Compiler) {
    if (this.local_debug) {
      if (envs.includes(this.local_debug)) {
        this.registerReplace(compiler);
        !process.env.LOCAL_DEBUG_NO_SERVER && this.addService(compiler);
      } else {
        console.log('当前process.env.LOCAL_DEBUG的值不是支持的类型，目前支持', envs.join(','));
        process.exit(1);
      }
    }
  }

  getHtml(html: string) {
    if (typeof html !== 'string') return html;
    const OSS_HOST = 'https://xxxx.com';
    const ENV = this.local_debug as string;
    const DEPLOY_ENV = this.local_debug as string;
    return html.replace(/__OSS_HOST__/gm, OSS_HOST).replace(/__ENV__/gm, YUNKE_ENV).replace(/__DEPLOY_ENV__/gm, DEPLOY_ENV);
  }

  replaceHtml(htmlPluginData, callback) {
    if (typeof htmlPluginData.html === 'string') {
      htmlPluginData.html = this.getHtml(htmlPluginData.html);
    }
    callback(null, htmlPluginData);
  }

  registerReplace(compiler: Compiler) {
    if (compiler.hooks) {
      compiler.hooks.compilation.tap('LocalDebugSettingPlugin', (compilation) => {
        if (compilation.hooks.htmlWebpackPluginAfterHtmlProcessing) {
          compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync(
            'EnvReplaceWebpackPlugin',
            this.replaceHtml.bind(this),
          );
        } else {
          const htmlWebpackPlugin = compiler.options.plugins.filter((plugin) => plugin.constructor.name === 'HtmlWebpackPlugin');
          if (htmlWebpackPlugin.length) {
            htmlWebpackPlugin.forEach((item) => {
              item.constructor.getHooks(compilation).beforeEmit.tapAsync('LocalDebugSettingPlugin', this.replaceHtml.bind(this));
            });
          } else {
            const HtmlWebpackPlugin = require('html-webpack-plugin');
            if (!HtmlWebpackPlugin) {
              throw new Error('Please ensure that `html-webpack-plugin` was placed before `html-replace-webpack-plugin` in your Webpack config if you were working with Webpack 4.x!');
            }
            HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
              'EnvReplaceWebpackPlugin',
              this.replaceHtml.bind(this),
            );
          }
        }
      });
    } else {
      compiler.plugin('compilation', (compilation) => {
        compilation.plugin('html-webpack-plugin-before-html-processing', this.replaceHtml.bind(this));
      });
    }
  }


  addService(compiler) {
    const { outputRoot = '/dist', devServer = {}, publicPath = '/' } = this.userConfig;
    const contentBase = `${path.join(process.cwd(), outputRoot)}`;
    const devServerOptions = Object.assign({}, {
      publicPath,
      contentBase: [contentBase],
      historyApiFallback: true,
    }, devServer, { inline: false, lazy: true, writeToDisk: true, watchContentBase: false, filename: /not-to-match/ });

    if (!compiler.outputPath) {
      compiler.outputPath = path.join(process.cwd(), outputRoot);
    }

    compiler.hooks.done.tap('LocalDebugSettingPlugin', (stats) => {
      server.listen(devServerOptions.port, devServerOptions.host, (err: Error) => {
        if (err) {
          throw err;
        }
        console.log();
        console.log('- 已开启本地生产调试模式，可以直接使用上面的链接地址进行访问');
        console.log();
      });
    });

    const server = new WebpackDevServer(compiler, devServerOptions);
  }
}
