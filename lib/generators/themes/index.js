const fs = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const path = require('path');
const glob = require('glob');
const BasicGenerator = require('../../BasicGenerator');
const copys = require('./copy.json');

class Generator extends BasicGenerator {
  async prompting() {
    this.subtype = this.opts.subtype;
    if (!this.subtype) {
      const answers = await inquirer.prompt([
        {
          name: 'subtype',
          message: '请选择一个主题',
          type: 'list',
          choices: [
            {
              name: `${'project'.padEnd(15)} - ${chalk.gray('项目中心主题.')}`,
              value: 'project',
              short: 'project',
            },
            {
              name: `${'platform'.padEnd(15)} - ${chalk.gray('平台主题.')}`,
              value: 'platform',
              short: 'platform',
            },
            {
              name: `${'orgadmin'.padEnd(15)} - ${chalk.gray('组织端主题.')}`,
              value: 'orgadmin',
              short: 'orgadmin',
            },
          ],
        },
      ]);
      this.subtype = answers.subtype;
    }
  }

  writing() {
    // 检查是否安装了包
    const { devDependencies = {} } = this.fs.readJSON(this.destinationPath('./package.json'));
    const themePackage = `@wetrial/theme-${this.subtype}`;
    if (!devDependencies[themePackage]) {
      const errorMessage = `> 本地不存在模块包${themePackage}，请先安装:yarn add ${themePackage} -D`;
      console.error(chalk.red(errorMessage));
      throw new Error(errorMessage);
    }
    // 覆盖安装主题相关文件
    const relativeSourcePath = `./node_modules/@wetrial/theme-${this.subtype}`;

    // 查询出所有需要copy的文件列表
    let needCopyFiles = [];
    copys.forEach((item) => {
      const itemDestPath = `${relativeSourcePath}/${item}`;
      const itemFiles = glob
        .sync(itemDestPath, {
          cwd: this.destinationPath(),
          dot: true,
        })
        .map((matchPath) => {
          return path.relative(relativeSourcePath, matchPath);
        });
      needCopyFiles = [...needCopyFiles, ...itemFiles];
    });

    // 拷贝文件
    needCopyFiles.forEach((item) => {
      const itemDestPath = this.destinationPath(`./${item}`);
      if (fs.existsSync(itemDestPath)) {
        fs.unlinkSync(itemDestPath);
      }
      const sourcePath = this.destinationPath(relativeSourcePath, item);
      fs.copyFileSync(sourcePath, itemDestPath);
    });
    // 复写package-module.json中的theme
    const packageModule = this.fs.readJSON(this.destinationPath('./package-module.json'));
    packageModule.theme = this.subtype;
    fs.writeFileSync(this.destinationPath('package-module.json'), JSON.stringify(packageModule), {
      encoding: 'utf8',
      flag: 'w',
    });
  }
}

module.exports = Generator;
