class ControlNpmPackageSideEffectsPlugin {
  noSideEffectsPackages: string[]
  hadSideEffectsPackages: string[]
  constructor({
    noSideEffectsPkgs = [], // 传入需要处理的npm package name
    hadSideEffectsPkgs = [], // 传入需要处理的npm package name
  } = {}) {
    this.noSideEffectsPackages = noSideEffectsPkgs;
    this.hadSideEffectsPackages = hadSideEffectsPkgs;
  }
  apply(compiler: Compiler) {
    if (!this.noSideEffectsPackages.length && !this.hadSideEffectsPackages.length) return;
    const name = this.constructor.name;

    compiler.hooks.normalModuleFactory.tap(name, (normalModuleFactory) => {
      // 在module实例创建之后，通过修改module相关的meta数据信息，改变模块或者包的sideEffects配置
      normalModuleFactory.hooks.module.tap(name, (module, data) => {
        const resolveData = data.resourceResolveData;

        // 如果npm包没有设置sideEffects，且满足includePackages，就设置sideEffectFree: true,表示该模块是纯的
        if (
          this.noSideEffectsPackages.some((item) => data?.resource?.includes(item)) &&
          resolveData &&
          resolveData.descriptionFileData &&
          resolveData.descriptionFileData.sideEffects === void 0
        ) {
          // 处理npm包没有标记了sideEffects的场景
          module.factoryMeta.sideEffects = false;
        }

        if (
          this.hadSideEffectsPackages.some((item) => data?.resource?.includes(item)) &&
          resolveData &&
          resolveData.descriptionFileData &&
          resolveData.descriptionFileData.sideEffects !== void 0
        ) {
          // 处理npm包标记了sideEffects的场景
          resolveData.descriptionFileData.sideEffects = undefined;
        }
      });
    });
  }
}
