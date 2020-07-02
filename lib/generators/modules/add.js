const chalk = require('chalk');
const rimraf = require('rimraf');
const fs = require('fs');
const { getPackages } = require('./core/package');
const { addPackageToDevs } = require('./core/script');
const BasicGenerator = require('./ModulesBaseGenerator');

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
    // 执行命令安装到本地
    const result = await addPackageToDevs({ packages, cwd: process.cwd() });
    if (!result) {
      process.exit(1);
    }
    // 在package.json中增加安装模块记录
    const moduleVersion = {};
    new Promise((resolve) => {
      // 遍历包拷贝文件到项目的modules下
      const _tempPackages = getPackages(packages);
      let executeCount = _tempPackages.length;
      _tempPackages.forEach((pkg) => {
        const namespacePath = pkg.namespace ? `${pkg.namespace}/` : '';
        const packageFullName = `${namespacePath}${pkg.name}`;
        const destinationPath = this.destinationPath(`src/modules/${pkg.name}`);
        // 先清空目标目录
        rimraf(destinationPath, (err) => {
          if (err) {
            console.error(chalk.red(`> 删除模块文件失败：${err.message}`));
          }
          this.fs.copy(this.destinationPath(`node_modules/${packageFullName}`), destinationPath);
          moduleVersion[packageFullName] = this.fs.readJSON(
            this.destinationPath(`node_modules/${packageFullName}/package.json`),
          ).version;
          executeCount--;
          if (executeCount === 0) {
            resolve(true);
          }
        });
      });
    }).then(() => {
      // 将模块记录到模块记录文件package-module.json
      const packageModule = this.fs.readJSON(this.destinationPath('package-module.json'));
      packageModule['modules'] = { ...packageModule['modules'], ...moduleVersion };
      fs.writeFileSync(this.destinationPath('package-module.json'), JSON.stringify(packageModule), {
        encoding: 'utf8',
        flag: 'w',
      });
    });
  }
}

module.exports = Generator;
