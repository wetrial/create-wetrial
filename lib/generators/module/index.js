const { exec } = require('child_process');
const rimraf = require('rimraf');
const path = require('path');
const fs = require('fs');
const dependencyResolve = require('./core/dependencyResolve');
const { copyFolder, mkdirsSync } = require('./core/pathHelper');

const BasicGenerator = require('../../BasicGenerator');

class Generator extends BasicGenerator {
  prompting() {
    const prompts = [
      {
        name: 'type',
        message: '请选择操作类型',
        type: 'list',
        choices: [
          {
            name: `${'add'.padEnd(15)} - 安装|更新 模块`,
            value: 'add',
            short: 'add',
          },
          {
            name: `${'remove'.padEnd(15)} - 卸载 模块`,
            value: 'remove',
            short: 'remove',
          },
        ],
      },
      {
        name: 'name',
        message: `应用模块名称?`,
        default: '@wetrial/template',
      },
    ];
    return this.prompt(prompts).then((props) => {
      this.prompts = props;
    });
  }

  writing() {
    // this.prompts = {
    //   name: '@wetrial/template',
    //   type: 'remove',
    // };
    // const cwd = 'D:/Other/temp/test';
    const cwd = process.cwd();
    console.info(`cwd路径:${cwd}`);
    const isAdd = this.prompts.type === 'add';
    const wetrialModulePath = path.join(cwd, '.wetrial-modules');
    mkdirsSync(wetrialModulePath);

    const packages = this.prompts.name.split(' ').map((item) => {
      const packageObj = {
        namespace: '',
        name: '',
        version: '',
      };
      if (item.startsWith('@')) {
        var tem = item.split('/');
        packageObj.namespace = tem[0];
        packageObj.name = tem[1].split('@')[0];
        if (item.lastIndexOf('@') > 0) {
          packageObj.version = item.split('/')[1].split('@')[1];
        }
      } else {
        packageObj.name = item.split('@')[0];
        packageObj.version = item.split('@')[1];
      }
      return packageObj;
    });

    let npmUrl = 'http://172.16.170.34:8000';
    if (fs.existsSync(path.join(wetrialModulePath, './package.json'))) {
      const itemUrl = require(path.join(wetrialModulePath, './package.json'))['npm-url'];
      npmUrl = itemUrl || npmUrl;
    }

    exec(
      isAdd
        ? `yarn add ${this.prompts.name} --registry ${npmUrl}`
        : `yarn remove ${this.prompts.name} --registry ${npmUrl}`,
      {
        cwd: wetrialModulePath,
      },
      (error) => {
        if (error) {
          console.error(`操作失败：${error.message}`);
          return;
        }
        // 安装
        if (isAdd) {
          // 找文件 拷贝到pages下面去
          packages.forEach((item) => {
            let modulePath = item.namespace ? `${item.namespace}/` : '';
            modulePath = modulePath + item.name;

            const sourceRoot = path.join(wetrialModulePath, `./node_modules/${modulePath}`);

            const moduleName = item.name;
            const sourcePagesPath = path.join(sourceRoot, `./dist/pages/${moduleName}`);
            const destPagesPath = path.join(cwd, `./src/pages`);
            const destPagesModulePath = path.join(destPagesPath, moduleName);
            if (fs.existsSync(destPagesModulePath)) {
              console.info(`clear ${destPagesModulePath}`);
              rimraf.sync(destPagesModulePath);
              // deleteFolder(destPagesModulePath, true);
            }
            console.info(`copy folder from ${sourcePagesPath} ==> ${destPagesModulePath}`);
            // 页面文件
            copyFolder(sourcePagesPath, destPagesModulePath, true);
            // 路由文件
            const sourceRoutesPath = path.join(
              sourceRoot,
              `./dist/config/modules/${moduleName}.ts`,
            );
            const destRoutesPath = path.join(cwd, `./config/modules/${moduleName}.ts`);
            console.info(`copy folder from ${sourceRoutesPath} ==> ${destRoutesPath}`);
            fs.copyFileSync(sourceRoutesPath, destRoutesPath);
          });
          // 处理包下所有新增的deps、devPs
          dependencyResolve.resolve(cwd, packages);
        }
        // 卸载,移除模块文件
        else {
          packages.forEach((item) => {
            let moduleName = item.name;

            const destPagesPath = path.join(cwd, `./src/pages/${moduleName}`);
            if (fs.existsSync(destPagesPath)) {
              console.info(`clear ${destPagesPath}`);
              rimraf.sync(destPagesPath);
            }
            // 路由文件
            const destRoutesPath = path.join(cwd, `./config/modules/${moduleName}.ts`);
            if (fs.existsSync(destRoutesPath)) {
              console.info(`clear ${destRoutesPath}`);
              rimraf.sync(destRoutesPath);
            }
          });
        }

        console.info('执行完毕...');
      },
    );
  }
}

module.exports = Generator;
