const fs = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const BasicGenerator = require('../../BasicGenerator');

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
          default: '@wt/account',
        },
        {
          name: 'description',
          message: `项目的描述信息?`,
        },
      ]).then((props) => {
        this.prompts = props;

        const external = {
          lowerCaseName: '',
          upperCaseName: '',
        };
        const names = this.prompts.name.split('/');
        let tempName;
        if (names.length > 1) {
          tempName = names[names.length - 1].replace(/[-|_]/, '');
        } else {
          tempName = names[0].replace(/[-|_]/, '');
        }

        external.lowerCaseName = `${tempName.substr(0, 1).toLowerCase()}${tempName.substr(1)}`;
        external.upperCaseName = `${tempName.substr(0, 1).toUpperCase()}${tempName.substr(1)}`;

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
          return true;
        },
      });

      // 修改src/pages/Template ==》[external.upperCaseName]
      // 修改src/modules/blogs ==》src/modules/[external.lowerCaseName]
      this.fs.copy(
        this.templatePath('src/pages/document.ejs'),
        this.destinationPath('src/pages/document.ejs'),
      );

      this.fs.copyTpl(
        this.templatePath('src/modules/blogs/**'),
        this.destinationPath(`src/modules/${this.prompts.external.lowerCaseName}`),
        this.prompts,
      );
    } else {
      const templatePackage = this.templatePath('package.json');
      const curPackage = this.destinationPath('package.json');
      const templatePackageJson = this.fs.readJSON(templatePackage);
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
