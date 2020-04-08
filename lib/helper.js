/**
 * 下划线转换驼峰
 * @param {string} name 字符串值
 */
function toHump(name) {
  return name.replace(/[\_|-](\w)/g, function (all, letter) {
    return letter.toUpperCase();
  });
}

/**
 * 驼峰转换下划线
 * @param {string} name 名字
 */
function toLine(name) {
  return name
    .replace(/_/, '')
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
}

/**
 * 首字母大写
 * @param {string} name 字符串值
 */
function toFirstUpperCase(name) {
  return name.replace(/^(\w)/g, function (all, letter) {
    return letter.toUpperCase();
  });
}

/**
 * 首字母小写
 * @param {string} name 字符串值
 */
function toFirstLowerCase(name) {
  return name.replace(/^(\w)/g, function (all, letter) {
    return letter.toLowerCase();
  });
}

/**
 * 转大写命名 aa_bb==>AaBb
 * @param {string} name 命名
 */
function toUpperName(name) {
  const newName = toHump(name);
  return toFirstUpperCase(newName);
}

function toLowerName(name) {
  const newName = toLine(name);
  return toFirstLowerCase(newName);
}

module.exports = {
  toUpperName,
  toLowerName,
};
