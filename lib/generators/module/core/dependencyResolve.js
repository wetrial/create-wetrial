const path = require('path');
const fs = require('fs');
const prettier = require('prettier');

/**
 * 获取module package中的dep、devP对象
 * @param {string} package.json路径
 * @returns {dependencies:{},devDependencies:{}}
 */
function getModulePackage(package) {
  const packageObj = require(package);
  return {
    dependencies: packageObj.deps,
    devDependencies: packageObj.devps,
  };
}

/**
 * 获取package中的dep、devP对象
 * @param {string} package.json路径
 * @returns {dependencies:{},devDependencies:{}}
 */
function getPackage(package) {
  const packageObj = require(package);
  return {
    dependencies: packageObj.dependencies,
    devDependencies: packageObj.devDependencies,
  };
}

/**
 * 解析出键值对信息
 * @param {string} wetrialModule_nodeModules
 * @param {[{namespace:'',name:'',version:''}]} packages 包信息列表
 * @returns {
 *  '@wetrial/template':{dependencies:{},devDependencies:{}}
 * }
 */
function getModulesDevObj(wetrialModule_nodeModules, packages) {
  const moduleObj = {};
  packages.map((item) => {
    let itemPackage = item.namespace ? `${item.namespace}/` : '';
    itemPackage += item.name;
    const moduleDep = getModulePackage(
      path.join(wetrialModule_nodeModules, itemPackage, 'package.json'),
    );
    moduleObj[itemPackage] = moduleDep;
  });
  return moduleObj;
}

/**
 * 根据模块包中的依赖更新主包中的依赖
 * @param {'@wetrial/template':{dependencies:{},devDependencies:{}}} moduleDeps 模块包依赖集合
 * @param {string} cwdPackage 主package.json路径
 */
function updateToMainPackage(moduleDeps, cwdPackage) {
  const manDepObj = getPackage(cwdPackage);
  const needChanged = {
    dependencies: {},
    devDependencies: {},
  };
  for (const key in moduleDeps) {
    if (moduleDeps.hasOwnProperty(key)) {
      const packageDevObj = moduleDeps[key];
      const depDevChange = compare(packageDevObj, manDepObj, key, true);
      const depChange = compare(packageDevObj, manDepObj, key, false);
      needChanged.dependencies = { ...needChanged.dependencies, ...depChange };
      needChanged.devDependencies = { ...needChanged.devDependencies, ...depDevChange };
    }
  }
  const packageObj = require(cwdPackage);
  packageObj.dependencies = { ...packageObj.dependencies, ...needChanged.dependencies };
  packageObj.devDependencies = { ...packageObj.devDependencies, ...needChanged.devDependencies };
  fs.writeFileSync(
    cwdPackage,
    prettier.format(JSON.stringify(packageObj), {
      parser: 'json',
    }),
  );
}

function compare(source, dest, moduleName, isDev) {
  var depKey = isDev ? 'devDependencies' : 'dependencies';
  const mainDep = dest[depKey];
  const sourDep = source[depKey];
  const needAdd = {};
  for (const key in sourDep) {
    if (sourDep.hasOwnProperty(key)) {
      if (mainDep[key]) {
        if (sourDep[key] > mainDep[key]) {
          needAdd[key] = sourDep[key];
          console.log(
            `包${moduleName}中${depKey}>${key}的版本:${sourDep[key]},高于主应用(将进行更新...)`,
          );
        }
      } else {
        needAdd[key] = sourDep[key];
        console.log(`包${moduleName}中${depKey}新增${key}${sourDep[key]}`);
      }
    }
  }
  return needAdd;
}

/**
 * 解析模块包中新增的dependency到项目package.json
 * @param {string} cwd string，项目根路径
 * @param {[{namespace:'',name:'',version:''}]} packages 所有包信息
 */
function resolve(cwd, packages) {
  if (!Array.isArray(packages)) {
    packages = [packages];
  }
  try {
    const wetrialModule_nodeModules = path.join(cwd, '.wetrial-modules/node_modules');
    const cwdPackage = path.join(cwd, 'package.json');
    const moduleDepObj = getModulesDevObj(wetrialModule_nodeModules, packages);
    // 将模块包中有，而manDepObj中没有或者版本低于模块包中的进行更新
    updateToMainPackage(moduleDepObj, cwdPackage);
  } catch (error) {
    console.error(`解析dependency出错${packages.join(' ')}`, error);
  }
}

module.exports = {
  resolve,
};
