const BasicGenerator = require('./ModulesBaseGenerator');
const { getPackages } = require('./core/package');
const { addPackage } = require('./core/script');

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
    const result = await addPackage({ packages, cwd: process.cwd() });
    if (!result) {
      process.exit(1);
    }
    // 遍历包拷贝文件到项目的modules下
    getPackages(packages).forEach((pkg) => {
      const namespacePath = pkg.namespace ? `${pkg.namespace}/` : '';
      const destinationPath = this.destinationPath(`src/modules/${pkg.name}`);
      // 先清空目标目录
      this.fs.delete(destinationPath);
      this.fs.copy(
        this.destinationPath(`node_modules/${namespacePath}${pkg.name}`),
        destinationPath,
      );
    });
  }
}

module.exports = Generator;
