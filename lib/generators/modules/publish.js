const fs = require('fs');
const rimraf = require('rimraf');
const BasicGenerator = require('./ModulesBaseGenerator');

/**
 * 根据模块信息得到模块名称
 * @param {*} moduleObj
 */
const getModuleNames = (moduleObj) => {
  const modules = [];
  for (const key in moduleObj) {
    if (moduleObj.hasOwnProperty(key)) {
      const tmps = key.split('/');
      if (tmps.length > 0) {
        modules.push(tmps[tmps.length - 1]);
      }
    }
  }

  return modules;
};

class Generator extends BasicGenerator {
  writing() {
    // 发包的时候需要过滤掉其他安装的模块包
    const packageModule = this.fs.readJSON(this.destinationPath('package-module.json'), {});
    const { modules = {} } = packageModule;

    const moduleNames = getModuleNames(modules);

    const moduleName = fs
      .readdirSync(this.destinationPath(`src/modules`))
      .filter((f) => moduleNames.indexOf(f) === -1 && !f.startsWith('.'))[0];
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
