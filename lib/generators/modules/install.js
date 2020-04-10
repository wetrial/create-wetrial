const BasicGenerator = require('./ModulesBaseGenerator');
const { getPackages, getPackageModules } = require('./core/package');
const { install } = require('./core/script');
const rimraf = require('rimraf');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const clipboardy = require('clipboardy');

class Generator extends BasicGenerator {
  async writing() {
    // 读取到package.json中的模块文件
    // const { modules = {} } = this.fs.readJSON('package.json');
    // const packages = getPackageModules(modules);
    // const strPackage = packages
    //   .map((item) => {
    //     const namespace = item.namespace ? `${item.namespace}/` : '';
    //     const version = item.version ? `@${item.version}` : '';
    //     return `${namespace}${name}${version}`;
    //   })
    //   .join(' ');
    // 执行命令安装到本地
    const result = await install({ cwd: process.cwd() });
    if (!result) {
      process.exit(1);
    }

    // 安装包到src/modules目录
    const { modules = {} } = this.fs.readJSON(this.destinationPath('package-module.json'));
    const packages = getPackageModules(modules);
    packages.forEach((pkg) => {
      const namespacePath = pkg.namespace ? `${pkg.namespace}/` : '';
      const destinationPath = this.destinationPath(`src/modules/${pkg.name}`);
      // 先清空目标目录
      rimraf(destinationPath, (err) => {
        if (err) {
          console.error(chalk.red(`> 删除模块文件失败：${err.message}`));
        }
        this.fs.copy(
          this.destinationPath(`node_modules/${namespacePath}${pkg.name}`),
          destinationPath,
        );
      });
    });
  }
}

module.exports = Generator;
