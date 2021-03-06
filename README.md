# create-wetrial

> Base umi

Creates a UmiJS application/plugin/block/library using the command line.

[![codecov](https://codecov.io/gh/wetrial/create-wetrial/branch/master/graph/badge.svg)](https://codecov.io/gh/wetrial/create-wetrial) [![NPM version](https://img.shields.io/npm/v/create-wetrial.svg?style=flat)](https://npmjs.org/package/create-wetrial) [![CircleCI](https://circleci.com/gh/wetrial/create-wetrial/tree/master.svg?style=svg)](https://circleci.com/gh/wetrial/create-wetrial/tree/master) [![NPM downloads](http://img.shields.io/npm/dm/create-wetrial.svg?style=flat)](https://npmjs.org/package/create-wetrial) [![GitHub Actions status](https://github.com/wetrial/create-wetrial/workflows/Node%20CI/badge.svg)](https://github.com/wetrial/create-wetrial)

## Usage

```bash
$ yarn create wetrial [appName]
```

## Boilerplates

- `app` - 创建一个宿主应用
- `module` - 创建一个子模块
- `modules` - 管理子模块

## Usage Example

```bash
$ yarn create wetrial

? Select the boilerplate type (Use arrow keys)
❯ app             - 创建一个宿主应用
  module           - 创建一个子模块
  modules           - 管理子模块

  create abc/package.json
  create abc/.gitignore
  create abc/.editorconfig
  create abc/.env
  create abc/.eslintrc
  create abc/.prettierignore
  create abc/.prettierrc
  create abc/.umirc.js
  create abc/mock/.gitkeep
  create abc/src/assets/yay.jpg
  create abc/src/global.css
  create abc/src/layouts/index.css
  create abc/src/layouts/index.tsx
  create abc/src/pages/index.css
  create abc/src/pages/index.tsx
  create abc/tsconfig.json
  create abc/typings.d.ts
 📋  Copied to clipboard, just use Ctrl+V
 ✨  File Generate Done
```

## FAQ

### `yarn create wetrial` command failed

这个问题基本上都是因为没有添加 yarn global module 的路径到 PATH 环境变量引起的。

先执行 `yarn global bin` 拿到路径，然后添加到 PATH 环境变量里。

```bash
$ yarn global bin
/usr/local/bin
```

你也可以尝试用 npm，

```bash
$ npm create wetrial
```

带默认类型

```bash
$ yarn create wetrial --type modules --subtype install
```

或者手动安装 create-wetrial，并执行他，

```bash
$ npm install create-wetrial -g
$ create-wetrial -v
```

## debugger

node cli.js

## Questions & Suggestions

Please open an issue [here](https://github.com/wetrial/create-wetrial/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc).

## LICENSE

MIT
