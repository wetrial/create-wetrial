const fs = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const glob = require('glob');
const BasicGenerator = require('../../BasicGenerator');
const helper = require('../../helper');

class Generator extends BasicGenerator {
  async prompting() {
    this.subtype = this.opts.subtype;
    if (!this.subtype) {
      const answers = await inquirer.prompt([
        {
          name: 'subtype',
          message: '请选择一个操作类型',
          type: 'list',
          choices: [
            {
              name: `${'create'.padEnd(15)} - ${chalk.gray('创建一个新的宿主应用.')}`,
              value: 'create',
              short: 'create',
            },
            {
              name: `${'update'.padEnd(15)} - ${chalk.gray('更新当前宿主应用.')}`,
              value: 'update',
              short: 'update',
            },
          ],
        },
      ]);
      this.subtype = answers.subtype;
    }
    if (this.subtype === 'create') {
      return this.prompt([
        {
          name: 'name',
          message: `项目的名称?`,
          default: path.basename(this.opts.env.cwd),
        },
        {
          name: 'theme',
          message: '请选择一个主题',
          type: 'list',
          choices: [
            {
              name: `${'project-center'.padEnd(15)} - ${chalk.gray('项目中心主题.')}`,
              value: 'project-center',
              short: 'project-center',
            },
            {
              name: `${'platform-admin'.padEnd(15)} - ${chalk.gray('平台管理主题.')}`,
              value: 'platform-admin',
              short: 'platform-admin',
            },
            {
              name: `${'platform-portal'.padEnd(15)} - ${chalk.gray('平台门户主题.')}`,
              value: 'platform-portal',
              short: 'platform-portal',
            },
            {
              name: `${'user-center'.padEnd(15)} - ${chalk.gray('个人中心主题.')}`,
              value: 'user-center',
              short: 'user-center',
            },
            {
              name: `${'org-admin'.padEnd(15)} - ${chalk.gray('组织管理主题.')}`,
              value: 'org-admin',
              short: 'org-admin',
            },
            {
              name: `${'org-portal'.padEnd(15)} - ${chalk.gray('组织门户主题.')}`,
              value: 'org-portal',
              short: 'org-portal',
            },
          ],
        },
        {
          name: 'description',
          message: `项目的描述信息?`,
        },
        {
          name: 'user',
          message: `author?`,
        },
        {
          name: 'email',
          message: `邮箱?`,
        },
      ]).then((props) => {
        this.prompts = props;

        const external = {
          lowerCaseName: '',
          upperCaseName: '',
          fullLowerCaseName: '',
        };
        const names = this.prompts.name.split('/');
        let tempName;
        if (names.length > 1) {
          tempName = names[names.length - 1];
        } else {
          tempName = names[0];
        }

        external.lowerCaseName = helper.toLowerName(tempName);
        external.upperCaseName = helper.toUpperName(tempName);
        external.fullLowerCaseName = helper.toFullLowerName(tempName);
        external.trimThemeLowerCaseName = helper.trimThemeLowerName(
          helper.toFullLowerName(tempName),
        );
        external.isApp = true;

        this.prompts.external = external;
      });
    }
  }

  writing() {
    // this.subtype = 'create';
    // this.prompts = {
    //   name: '@wt/project',
    //   description: '暂无描述',
    //   external: {
    //     lowerCaseName: 'project',
    //     upperCaseName: 'Project',
    //   },
    // };
    if (this.subtype === 'create') {
      this.writeFiles({
        context: this.prompts,
        filterFiles: (f) => {
          if (f === 'src/pages/document.ejs') {
            return false;
          }
          if (f.startsWith('src/modules')) {
            return false;
          }
          if (f === '.gitignore') {
            return false;
          }
          return true;
        },
      });

      this.fs.copy(
        this.templatePath('src/pages/document.ejs'),
        this.destinationPath('src/pages/document.ejs'),
      );
      let gitIgnore = this.fs.read(this.templatePath('.gitignore'));
      gitIgnore = `${gitIgnore}\r\n/src/modules`;
      this.fs.write(this.destinationPath('.gitignore'), gitIgnore);
    } else {
      const templatePackage = this.templatePath('package.json');
      const curPackage = this.destinationPath('package.json');
      // 以字符串形式读取再去掉<%%>之间的内容后转换成json
      const templatePackageJson = JSON.parse(
        this.fs
          .read(templatePackage)
          .replace(/<%.+%>/gi, '')
          .replace(/\"@wt\/.+\"\s*:\s*\"latest\"\s*,/gi, ''),
      ); // this.fs.readJSON(templatePackage);

      let curPackageJson = this.fs.readJSON(curPackage);
      curPackageJson = {
        ...curPackageJson,
        dependencies: {
          ...curPackageJson.dependencies,
          ...templatePackageJson.dependencies,
        },
        devDependencies: {
          ...curPackageJson.devDependencies,
          ...templatePackageJson.devDependencies,
        },
      };
      this.fs.writeJSON(curPackage, curPackageJson);
    }
  }
}

module.exports = Generator;
