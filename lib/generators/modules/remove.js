const BasicGenerator = require('./ModulesBaseGenerator');
const { getPackages } = require('./core/package');
const { removePackage } = require('./core/script');

class Generator extends BasicGenerator {
  prompting() {
    if (!this.name) {
      const prompts = [
        {
          name: 'packages',
          message: `子应用模块`,
          default: '',
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
    const result = await removePackage({ packages, cwd: process.cwd() });
    if (!result) {
      process.exit(1);
    }
    // 遍历包拷贝文件到项目的modules下
    getPackages(packages).forEach((pkg) => {
      const destinationPath = this.destinationPath(`src/modules/${pkg.name}`);
      // 删除目录
      this.fs.delete(destinationPath);
    });
  }
}

module.exports = Generator;
