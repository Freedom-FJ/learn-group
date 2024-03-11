const pluginName = 'ReactAutoRoutePlugin'
class ReactAutoRoutePlugin extends BaseRoute {

  constructor(options: IGetRoutesOpts) {
    super(options);
    this.options = options;
    this.isWriting = false;
  }

  apply(compiler: Compiler) {
    if (process.env.NODE_ENV === 'production') {
      compiler.hooks.run.tapPromise(pluginName, async () => {
        await this.writeFile();
      })
    } else {
      compiler.hooks.initialize.tap(pluginName, async () => {
        await this.writeFile();
        this.watchAndWriteFile();
      })
    }
  }
}


module.exports = ReactAutoRoutePlugin;
