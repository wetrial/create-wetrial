const BasicGenerator = require('../../BasicGenerator');

class Generator extends BasicGenerator {
  // prompting() {
  //   this.prompts = {
  //     name: this.name,
  //     description: 'demo',
  //   };

  //   const external = {
  //     lowerCaseName: '',
  //     upperCaseName: '',
  //   };
  //   const names = this.prompts.name.split('/');
  //   let tempName = names[names.length - 1];
  //   external.lowerCaseName = `${tempName.substr(0, 1).toLowerCase()}${tempName.substr(1)}`;
  //   external.upperCaseName = `${tempName.substr(0, 1).toUpperCase()}${tempName.substr(1)}`;

  //   this.prompts.external = external;
  // }

  prompting() {
    const prompts = [
      {
        name: 'name',
        message: `项目的名称?`,
        default: this.name,
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
      let tempName = names[names.length - 1];
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
        return true;
      },
    });

    // 修改src/pages/Template ==》[external.upperCaseName]
    // 修改config/modules/template.ts ==》[external.lowerCaseName].ts
    this.fs.copy(
      this.templatePath('src/pages/document.ejs'),
      this.destinationPath('src/pages/document.ejs'),
    );
    this.fs.move(
      this.destinationPath('config/modules/template.ts'),
      this.destinationPath(`config/modules/${this.prompts.external.lowerCaseName}.ts`),
    );
    // Template文件夹
    this.fs.move(
      this.destinationPath('src/pages/template/dashboard'),
      this.destinationPath(`src/pages/${this.prompts.external.lowerCaseName}`),
    );
    this.fs.move(
      this.destinationPath('src/pages/template/sample'),
      this.destinationPath(`src/pages/${this.prompts.external.lowerCaseName}`),
    );
  }
}

module.exports = Generator;
