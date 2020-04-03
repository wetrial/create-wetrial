const BasicGenerator = require('./ModulesBaseGenerator');
const { getPackages } = require('./core/package');
const { install } = require('./core/script');
const rimraf = require('rimraf');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const clipboardy = require('clipboardy');

class Generator extends BasicGenerator {
  async writing() {
    // 执行命令安装到本地
    const result = await install({ cwd: process.cwd() });
    if (!result) {
      process.exit(1);
    }
    // 遍历模块下面的包挨个拷贝到src/modules下
    const packages = fs
      .readdirSync(this.destinationPath(`src/modules`))
      .filter((f) => !f.startsWith('.'));

    const strPackages = packages
      .map((item) => {
        const { name, version } = require(`${item}/package.json`);
        return `${name}@${version}`;
      })
      .join(' ');
    getPackages(strPackages).forEach((pkg) => {
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
