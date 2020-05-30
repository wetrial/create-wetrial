const { exec } = require('child_process');
const chalk = require('chalk');
// const rimraf = require('rimraf');
// const path = require('path');
// const fs = require('fs');

/**
 * 安装包到本地
 * @param {packages:'',cwd:string} param.packages 包名称，多个以空格隔开 param.cwd:执行目录
 */
function install({ cwd }) {
  return new Promise((resolve, reject) => {
    const executer = exec(
      `yarn install`,
      {
        cwd,
      },
      error => {
        if (error) {
          console.error(chalk.red(`> 安装失败，请尝试手动安装：${error.message}`));
          reject(error);
          process.exit(1);
        }
        resolve(true);
      },
    );
    executer.stdout.on('data', function(data) {
      console.log(data);
    });
  });
}

/**
 * 安装包到本地
 * @param {packages:'',cwd:string} param.packages 包名称，多个以空格隔开 param.cwd:执行目录
 */
function addPackage({ packages, cwd }) {
  return new Promise((resolve, reject) => {
    console.log(`yarn add ${packages}`);
    const executer = exec(
      `yarn add ${packages}`,
      {
        cwd,
      },
      error => {
        if (error) {
          console.error(chalk.red(`> 下载远程npm包失败：${error.message}`));
          reject(error);
          process.exit(1);
        }
        resolve(true);
      },
    );
    executer.stdout.on('data', function(data) {
      console.log(data);
    });
  });
}

/**
 * 安装包到本地
 * @param {packages:'',cwd:string} param.packages 包名称，多个以空格隔开 param.cwd:执行目录
 */
function addPackageToDevs({ packages, cwd }) {
  return new Promise((resolve, reject) => {
    console.log(`yarn add ${packages}`);
    const executer = exec(
      `yarn add ${packages} -D`,
      {
        cwd,
      },
      error => {
        if (error) {
          console.error(chalk.red(`> 下载远程npm包失败：${error.message}`));
          reject(error);
          process.exit(1);
        }
        resolve(true);
      },
    );
    executer.stdout.on('data', function(data) {
      console.log(data);
    });
  });
}

/**
 * 卸载包
 * @param {packages:'',cwd:string} param.packages 包名称，多个以空格隔开 param.cwd:执行目录
 */
function removePackage({ packages, cwd }) {
  return new Promise((resolve, reject) => {
    console.log(`yarn remove ${packages}`);
    const executer = exec(
      `yarn remove ${packages}`,
      {
        cwd,
      },
      (error, stdout, stderr) => {
        if (error) {
          // 处理package中没有，但是项目目录还在的情况
          if (stderr.indexOf("error This module isn't specified in a package.json file") !== -1) {
            resolve(true);
          } else {
            console.error(chalk.red(`> 卸载包失败：${stderr}`));
            process.exit(1);
          }
        }
        resolve(true);
      },
    );
    executer.stdout.on('data', function(data) {
      console.log(data);
    });
  });
}

module.exports = {
  addPackage,
  addPackageToDevs,
  removePackage,
  install,
};
