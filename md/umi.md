
## 目录：
```
├── config
|  ├── config.local.ts
|  ├── config.ts
|  ├── diamond.daily.vm
|  ├── diamond.pre.vm
|  ├── diamond.prod.vm
|  ├── document.tpl
|  ├── husky
|  └── routes.ts
├── mock
|  └── user.ts
├── scripts
|  └── create-mds.js
├── src
|  ├── app.tsx
|  ├── common
|  ├── components
|  ├── global.scss
|  ├── hooks
|  ├── i18n
|  ├── layout
|  ├── loading.tsx
|  ├── pages
|  ├── services
|  ├── styles
|  ├── types
|  └── vendors
├── abc.json
├── package.json
├── README.md
├── tsconfig.json
└── types.d.ts
```
## 配置项纪录：
### jsMinifier (webpack)

- 类型：string，可选值 esbuild, terser, swc, uglifyJs, none
- 默认值：esbuild

配置构建时压缩 JavaScript 的工具；none表示不压缩。
示例：
```
{
  jsMinifier: 'esbuild'
}
```
### jsMinifierOptions

- 类型：object
- 默认值：{}

jsMinifier 的配置项；默认情况下压缩代码会移除代码中的注释，可以通过对应的 jsMinifier 选项来保留注释。
示例：
```
{
  jsMinifier: 'esbuild',
  jsMinifierOptions: {
    minifyWhitespace: true,
    minifyIdentifiers: true,
    minifySyntax: true,
  }
}
```
配置项需要和所使用的工具对应，具体参考对应文档：

- [esbuild 参考](https://esbuild.github.io/api/#minify)
- [terser 参考](https://terser.org/docs/api-reference#minify-options)
- [swc 参考](https://swc.rs/docs/configuration/minification#configuration)
- [uglifyJs 参考](https://lisperator.net/uglifyjs/compress)
## 页面点击跳转到代码组建
config配置 
```javascript
{
  clickToComponent: { editor: 'vscode' },
}
```
开启后，可通过 Option+Click/Alt+Click 点击组件跳转至编辑器源码位置，Option+Right-click/Alt+Right-click 可以打开上下文，查看父组件。
详情： [https://umijs.org/docs/api/config#clicktocomponent](https://umijs.org/docs/api/config#clicktocomponent)
