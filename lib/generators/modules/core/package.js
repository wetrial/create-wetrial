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

module.exports = {
  getPackages,
};
