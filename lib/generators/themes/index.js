const fs = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const path = require('path');
const glob = require('glob');
const BasicGenerator = require('../../BasicGenerator');
const { getPackages } = require('../modules/core/package');
const { addPackageToDevs } = require('../modules/core/script');
const copys = require('./copy.json');

// add 切换新的主题
// update 更新主题
// install 安装主题文件到项目
class Generator extends BasicGenerator {
  async prompting() {
    this.subtype = this.opts.subtype;
    if (!this.subtype) {
      // const answers = await inquirer.prompt([
      //   {
      //     name: 'subtype',
      //     message: '请选择一个操作类型',
      //     type: 'list',
      //     choices: [
      //       // {
      //       //   name: `${'install'.padEnd(15)} - ${chalk.gray('仅从本地安装.')}`,
      //       //   value: 'install',
      //       //   short: 'install',
      //       // },
      //       {
      //         name: `${'add'.padEnd(15)} - ${chalk.gray('安装主题.')}`,
      //         value: 'add',
      //         short: 'add',
      //       },
      //       {
      //         name: `${'update'.padEnd(15)} - ${chalk.gray('更新当前主题.')}`,
      //         value: 'update',
      //         short: 'update',
      //       },
      //     ],
      //   },
      // ]);
      // this.subtype = answers.subtype;
      this.subtype = 'update';
    }
    // if (this.subtype === 'add') {
    //   const answers = await inquirer.prompt([
    //     {
    //       name: 'theme',
    //       message: '请选择一个主题',
    //       type: 'list',
    //       choices: [
    //         {
    //           name: `${'project-center'.padEnd(15)} - ${chalk.gray('项目中心主题.')}`,
    //           value: 'project-center',
    //           short: 'project-center',
    //         },
    //         {
    //           name: `${'platform-admin'.padEnd(15)} - ${chalk.gray('平台管理主题.')}`,
    //           value: 'platform-admin',
    //           short: 'platform-admin',
    //         },
    //         {
    //           name: `${'platform-portal'.padEnd(15)} - ${chalk.gray('平台门户主题.')}`,
    //           value: 'platform-portal',
    //           short: 'platform-portal',
    //         },
    //         {
    //           name: `${'user-center'.padEnd(15)} - ${chalk.gray('个人中心主题.')}`,
    //           value: 'user-center',
    //           short: 'user-center',
    //         },
    //         {
    //           name: `${'org-admin'.padEnd(15)} - ${chalk.gray('组织管理主题.')}`,
    //           value: 'org-admin',
    //           short: 'org-admin',
    //         },
    //         {
    //           name: `${'org-portal'.padEnd(15)} - ${chalk.gray('组织门户主题.')}`,
    //           value: 'org-portal',
    //           short: 'org-portal',
    //         },
    //       ],
    //     },
    //   ]);
    //   this.theme = answers.theme;
    // }
  }

  async writing() {
    // 解析theme
    if (this.subtype !== 'add') {
      const packageModule = this.fs.readJSON(this.destinationPath('./package-module.json'));
      if (!packageModule.theme) {
        console.error(chalk.red(`无法更新，检测到本地尚未安装任何主题，请先安装主题.`));
        throw new Error(errorMessage);
      }
      this.theme = packageModule.theme;
    }
    const themePackage = `@wetrial/theme-${this.theme}`;
    // 如果是update 则需要从远程安装最新的版本
    if (this.subtype === 'add' || this.subtype === 'update') {
      // 执行命令安装到本地
      const result = await addPackageToDevs({
        packages: themePackage,
        cwd: process.cwd(),
      });
      if (!result) {
        console.error(chalk.red(`安装主题包:${themePackage}出错`));
        process.exit(1);
      }
    }

    // 检查是否安装了包
    const { devDependencies = {} } = this.fs.readJSON(this.destinationPath('./package.json'));
    if (!devDependencies[themePackage]) {
      const errorMessage = `> 本地不存在模块包${themePackage}，请先安装:yarn add ${themePackage} -D`;
      console.error(chalk.red(errorMessage));
      throw new Error(errorMessage);
    }
    // 覆盖安装主题相关文件
    const relativeSourcePath = `./node_modules/@wetrial/theme-${this.theme}`;

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
    packageModule.theme = this.theme;
    fs.writeFileSync(this.destinationPath('package-module.json'), JSON.stringify(packageModule), {
      encoding: 'utf8',
      flag: 'w',
    });
  }
}

module.exports = Generator;
