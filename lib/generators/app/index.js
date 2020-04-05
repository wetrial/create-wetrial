const fs = require('fs');
const chalk = require('chalk');
const BasicGenerator = require('../../BasicGenerator');

class Generator extends BasicGenerator {
  // prompting() {
  //   this.prompts = {
  //     name: '@wetrial/template',
  //     description: 'demo',
  //   };

  //   const external = {
  //     lowerCaseName: '',
  //     upperCaseName: '',
  //   };
  //   const names = this.prompts.name.split('/');
  //   let tempName;
  //   if (names.length > 1) {
  //     tempName = names[names.length - 1].replace(/[-|_]/, '');
  //   } else {
  //     tempName = names[0].replace(/[-|_]/, '');
  //   }

  //   external.lowerCaseName = `${tempName.substr(0, 1).toLowerCase()}${tempName.substr(1)}`;
  //   external.upperCaseName = `${tempName.substr(0, 1).toUpperCase()}${tempName.substr(1)}`;

  //   this.prompts.external = external;
  // }

  prompting() {
    const prompts = [
      {
        name: 'name',
        message: `项目的名称?`,
        default: '@wt/account',
      },
      {
        name: 'description',
        message: `项目的描述信息?`,
      },
      // {
      //   name: 'isTypeScript',
      //   type: 'confirm',
      //   message: 'Do you want to use typescript?',
      //   default: false,
      // },
    ];
    return this.prompt(prompts).then(props => {
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

  writing() {
    this.writeFiles({
      context: this.prompts,
      filterFiles: f => {
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
  }
}

module.exports = Generator;
