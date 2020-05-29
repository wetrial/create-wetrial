// 查找文件夹里面所有的模块包文件夹 然后每个都去执行publish.js 生成dist目录
const fs = require('fs');
const chalk = require('chalk');
const rimraf = require('rimraf');
const BasicGenerator = require('./ModulesBaseGenerator');

// // 获取所有的包
// const modulePackages = fs
//   .readdirSync(`${__dirname}/generators`)
//   .filter((f) => !f.startsWith('.'))
//   .map((f) => {
//     return {
//       name: `${f.padEnd(15)} - ${chalk.gray(require(`./generators/${f}/meta.json`).description)}`,
//       value: f,
//       short: f,
//     };
//   });

// class Generator extends BasicGenerator {
//   writing() {
//     // 发包的时候需要过滤掉其他安装的模块包
//     const packageModule = this.fs.readJSON(this.destinationPath('package-module.json'), {});
//     const { modules = {} } = packageModule;

//     const moduleNames = getModuleNames(modules);

//     const moduleName = fs
//       .readdirSync(this.destinationPath(`src/modules`))
//       .filter((f) => moduleNames.indexOf(f) === -1 && !f.startsWith('.'))[0];
//     const distPath = this.destinationPath('dist');
//     try {
//       rimraf.sync(distPath);
//       this.fs.copy(this.destinationPath(`src/modules/${moduleName}`), distPath);
//     } catch (err) {
//       console.error(chalk.red(`出错啦:${err.message}`));
//     }
//   }
// }

// module.exports = Generator;
