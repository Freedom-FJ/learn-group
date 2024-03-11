export default class BuildZip {
  private options: Opts;
  constructor(options: Opts) {
    this.options = options;
  }
  async handlerZip(compilation: Compilation, callback: any) {
    if (compilation.compiler.isChild()) {
      return callback();
    }
    const { versionConfig, zipConfig } = this.options;
    const assetsCache = compilation.assets;
    // 将静态资源通过yazl处理成zip包
    const [zip, config] = await Promise.all([
      doZip(compilation, this.options),
      generateConfig(compilation, this.options),
    ]);

    // 兼容webpack5与webpack4,webpack5可以直接在compiler.webpack.sources上直接获取操作source相关的构造函数
    const { RawSource } = compilation.compiler.webpack
      ? compilation.compiler.webpack.sources
      : require('webpack-sources');

    // 将zip合并成一个
    const zipContent = new RawSource(Buffer.concat(zip as any) as any);
    if (zipConfig.removeBundle === true) {
      // 清空assets准备重新赋值
      compilation.assets = {};
    } else if (typeof zipConfig.removeBundle === 'function') {
      const assets = {} as { [key: string]: any };
      for (const name in compilation.assets) {
        if (compilation.assets.hasOwnProperty(name)) {
          if (!zipConfig.removeBundle(name, compilation.assets[name])) {
            assets[name] = compilation.assets[name];
          }
        }
      }

      compilation.assets = assets;
    }

    const zipFileName = zipConfig.filename.replace('.zip', '');
    const fileKeys = Object.keys(assetsCache);
    // 保留原来的js、css等静态资源
    fileKeys.map((key) => {
      compilation.assets[`${zipFileName}/${key}`] = assetsCache[key];
    });

    // 添加一个包含文件目录的txt
    compilation.assets[`${zipFileName}.txt`] = new RawSource(fileKeys.join('\n'));

    // 生成zip包
    compilation.assets[zipConfig.filename] = zipContent;

    const content = JSON.stringify(config, null, '\t');

    // 生成版本信息json文件
    compilation.assets[versionConfig.filename] = new RawSource(content);

    callback();
  }
  apply(compiler: Compiler) {
    const { pass } = this.options;
    if (!pass) {
      // webpack5注册hook
      if (compiler.hooks) {
        compiler.hooks.emit.tapAsync('BuildZipPlugin', this.handlerZip.bind(this));
      } else {
        // webpack4之前注册hook方式
        // @ts-ignore
        compiler.plugin('emit', this.handlerZip.bind(this));
      }
    }
  }
}
