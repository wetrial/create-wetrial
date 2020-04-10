const chalk = require('chalk');
const fs = require('fs');
const BasicGenerator = require('./ModulesBaseGenerator');
const { getPackages } = require('./core/package');
const { removePackage } = require('./core/script');
const rimraf = require('rimraf');

class Generator extends BasicGenerator {
  prompting() {
    if (!this.name) {
      const prompts = [
        {
          name: 'packages',
          message: `子应用模块`,
          default: '@wt/template',
        },
      ];
      return this.prompt(prompts).then((props) => {
        this.prompts = props;
      });
    }

    this.prompts = {
      packages: this.name,
    };
    return new Promise((resolve) => {
      resolve(true);
    });
  }

  async writing() {
    const { packages } = this.prompts;
    // 执行卸载命令
    const result = await removePackage({ packages, cwd: process.cwd() });
    if (!result) {
      process.exit(1);
    }

    // 遍历包拷贝文件到项目的modules下
    const removePackages = getPackages(packages);
    new Promise((resolve) => {
      let executeCount = removePackages.length;
      removePackages.forEach((pkg) => {
        const namespacePath = pkg.namespace ? `${pkg.namespace}/` : '';
        const destinationPath = this.destinationPath(`src/modules/${pkg.name}`);
        // 先清空目标目录
        rimraf(destinationPath, (err) => {
          if (err) {
            console.error(chalk.red(`> 删除模块文件失败：${err.message}`));
          }
          executeCount--;
          if (executeCount === 0) {
            resolve(true);
          }
        });
      });
    }).then(() => {
      // 将模块记录到模块记录文件package-module.json
      const packageModule = this.fs.readJSON(this.destinationPath('package-module.json'));
      removePackages.forEach((pkg) => {
        const pkgNameSpace = pkg.namespace ? `${pkg.namespace}/` : '';
        const fullName = `${pkgNameSpace}${pkg.name}`;
        delete packageModule['modules'][fullName];
      });
      fs.writeFileSync(this.destinationPath('package-module.json'), JSON.stringify(packageModule), {
        encoding: 'utf8',
        flag: 'w',
      });
    });
  }
}

module.exports = Generator;
