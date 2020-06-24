#!/usr/bin/env node

const yParser = require('yargs-parser');
const npmview = require('npmview');
const semver = require('semver');
const { existsSync } = require('fs');
const { join } = require('path');
const chalk = require('chalk');
const run = require('./lib/run');

// get local package name and version from package.json (or wherever)
const pkgName = require('./package.json').name;
const pkgVersion = require('./package.json').version;

// print version and @local
const args = yParser(process.argv.slice(2));

if (args.v || args.version) {
  console.log(require('./package').version);
  if (existsSync(join(__dirname, '.local'))) {
    console.log(chalk.cyan('@local'));
  }
  process.exit(0);
}

if (!semver.satisfies(process.version, '>= 10.0.0')) {
  console.error(chalk.red('✘ The generator will only work with Node v10.0.0 and up!'));
  process.exit(1);
}

const name = args._[0] || '';
const { type, subtype, ssubtype } = args;
delete args.type;
delete args.subtype;
delete args.ssubtype;

// get latest version on npm
npmview(pkgName, (err, version, moduleInfo) => {
  // compare to local version
  if (semver.gt(version, pkgVersion)) {
    console.log(
      chalk.green(`
                    **************************************************************
                    *                     本地cli需要更新                         *
                    *   .=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-.       *
                    *    |                     ______                     |      *
                    *    |                  .-"      "-.                  |      *
                    *    |                 /            \                 |      *
                    *    |     _          |              |          _     |      *
                    *    |    ( \         |,  .-.  .-.  ,|         / )    |      *
                    *    |     > "=._     | )(__/  \__)( |     _.=" <     |      *
                    *    |    (_/"=._"=._ |/     /\     \| _.="_.="\_)    |      *
                    *    |           "=._"(_     ^^     _)"_.="           |      *
                    *    |               "=\__|IIIIII|__/="               |      *
                    *    |              _.="| \IIIIII/ |"=._              |      *
                    *    |    _     _.="_.="\          /"=._"=._     _    |      *
                    *    |   ( \_.="_.="     '--------'     "=._"=._/ )   |      *
                    *    |    > _.="                            "=._ <    |      *
                    *    |   (_/                                    \_)   |      *
                    *    |                                                |      *
                    *    '-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-='      *
                    *                                                            *
                    *           本地当前版本：${pkgVersion},  最新版本：${version}              *
                    *      执行 yarn global add create-wetrial 升级到最新版本      *
                    **************************************************************
      `),
    );
  }
  run({
    name,
    type,
    subtype,
    ssubtype,
    args,
  });
});
