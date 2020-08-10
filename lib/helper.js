/**
 * 下划线转换驼峰
 * @param {string} name 字符串值
 */
function toHump(name) {
  return name.replace(/[\.\_-](\w)/g, function (all, letter) {
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
 * 转大写命名 aa_bb==>AaBb aa-bb==>AaBb  aa.bb==>AaBb
 * @param {string} name 命名
 */
function toUpperName(name) {
  const newName = toHump(name);
  return toFirstUpperCase(newName);
}

/**
 * 处理 ProjectName==>project_name的情况
 * @param {string} name
 */
function toLowerName(name) {
  const newName = toLine(name);
  return toFirstLowerCase(newName);
}

/**
 * 处理xxx-xxx==> xxx_xxx的情况
 * @param {string} name
 */
function toFullLowerName(name) {
  let newName = toLine(name);
  newName = toFirstLowerCase(newName);
  return newName.replace(/-/gi, '_');
}

/**
 * 去掉主题的小写名称  organizations_org_admin==>organizations  project_center_org_admin==> project-center
 * @param {*} name
 */
function trimThemeLowerName(name) {
  return name
    .replace(
      /_((project_center)|(platform_admin)|(platform_portal)|(user_center)|(org_admin)|(org_portal))$/gi,
      '',
    )
    .replace(/_/gi, '-');
}

module.exports = {
  toUpperName,
  toLowerName,
  toFullLowerName,
  trimThemeLowerName,
};
