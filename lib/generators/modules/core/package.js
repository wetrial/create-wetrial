/**
 * 根据字符串形式的包名称获取包列表对象
 * @param {string} strPackages 字符串形式的多个包名称
 * @return [{namespace:'',name:'',version:''}]
 * @example getPackages('@wetrial/blogs@^4.1.2')==>[{namespace:'@wetrial',name:'blogs',version:'^4.1.2'}]
 */
function getPackages(strPackages = '') {
  const packages = strPackages.split(' ').filter((m) => m);
  return packages.map((item) => {
    const arrPackages = item.split('/');
    const strNamespace = arrPackages.length > 1 ? arrPackages[0] : '';
    const strNameVersion = arrPackages.length > 1 ? arrPackages[1] : arrPackages[0];

    const nameVersions = strNameVersion.split('@');
    return {
      namespace: strNamespace,
      name: nameVersions[0],
      version: nameVersions.length > 1 ? nameVersions[1] : '',
    };
  });
}

/**
 * 获取package中的模块包列表
 * @param {string} moduleObj 模块对象
 * @return [{namespace:'',name:'',version:''}]
 */
function getPackageModules(moduleObj) {
  const result = [];
  for (const name in moduleObj) {
    if (moduleObj.hasOwnProperty(name)) {
      const tempVersionNames = name.split('/');
      result.push({
        namespace: tempVersionNames.length === 2 ? tempVersionNames[0] : '',
        name: tempVersionNames.length === 2 ? tempVersionNames[1] : tempVersionNames[0],
        version: moduleObj[name],
      });
    }
  }
  return result;
}

module.exports = {
  getPackages,
  getPackageModules,
};
