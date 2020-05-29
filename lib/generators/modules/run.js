const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const inquirer = require('inquirer');
const clipboardy = require('clipboardy');

const runGenerator = async (generatorPath, { name = '', cwd = process.cwd(), args = {} }) => {
  return new Promise((resolve) => {
    const Generator = require(generatorPath);
    const generator = new Generator({
      name,
      env: {
        cwd,
      },
      resolved: require.resolve(generatorPath),
      args,
    });

    return generator.run(() => {
      console.log('✨ File Generate Done');
      resolve(true);
    });
  });
};

//{name:'',subtype:'',args:[]}
const run = async (config) => {
  process.send && process.send({ subtype: 'prompt' });
  process.emit('message', { subtype: 'prompt' });

  let { subtype } = config;
  if (!subtype) {
    const answers = await inquirer.prompt([
      {
        name: 'subtype',
        message: '请选择一个操作类型',
        type: 'list',
        choices: [
          {
            name: `${'add'.padEnd(15)} - ${chalk.gray('安装或更新一个新的子应用模块.')}`,
            value: 'add',
            short: 'add',
          },
          {
            name: `${'install'.padEnd(15)} - ${chalk.gray('将已安装的子应用模块安装到宿主应用.')}`,
            value: 'install',
            short: 'install',
          },
          {
            name: `${'publish'.padEnd(15)} - ${chalk.gray('发布当前子应用模块.')}`,
            value: 'publish',
            short: 'publish',
          },
          // {
          //   name: `${'publish-all'.padEnd(15)} - ${chalk.gray('发布所有模块.')}`,
          //   value: 'publish-all',
          //   short: 'publish-all',
          // },
          {
            name: `${'remove'.padEnd(15)} - ${chalk.gray('卸载指定的子应用模块.')}`,
            value: 'remove',
            short: 'remove',
          },
        ],
      },
    ]);
    subtype = answers.subtype;
  }

  try {
    return runGenerator(`./${subtype}`, config);
  } catch (e) {
    console.error(chalk.red(`> Generate failed`), e);
    process.exit(1);
  }
};

module.exports = run;
