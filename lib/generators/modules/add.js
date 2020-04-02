const BasicGenerator = require('./ModulesBaseGenerator');

class Generator extends BasicGenerator {
  prompting() {
    const prompts = [
      {
        name: 'name',
        message: `子应用模块`,
        default: '',
      },
    ];
    return this.prompt(prompts).then(props => {
      this.prompts = props;
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

    const f1 = this.destinationPath('config/modules/template.ts');
    const tf1 = this.destinationPath(`config/modules/${this.prompts.external.lowerCaseName}.ts`);
    console.log(`${f1} - ${tf1}`);

    if (this.prompts.external.lowerCaseName !== 'template') {
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
}

module.exports = Generator;
