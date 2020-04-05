const fs = require('fs');
const rimraf = require('rimraf');
const BasicGenerator = require('./ModulesBaseGenerator');

class Generator extends BasicGenerator {
  writing() {
    // 执行命令安装到本地
    const moduleName = fs
      .readdirSync(this.destinationPath(`src/modules`))
      .filter(f => !f.startsWith('.'))[0];
    const distPath = this.destinationPath('dist');
    try {
      rimraf.sync(distPath);
      this.fs.copy(this.destinationPath(`src/modules/${moduleName}`), distPath);
    } catch (err) {
      console.error(chalk.red(`> 删除dist目录失败：${err.message}`));
    }
  }
}

module.exports = Generator;
