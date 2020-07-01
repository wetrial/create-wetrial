import { history } from 'umi';
import { IKeyValue } from '@wetrial/core';
import { getRoutePreFix } from '@wetrial/core/es/route-helper';

/**
 * 调用history的 push，会自动追加前缀路由(如果应用使用了)
 * @param opt
 */
export function historyPush(
  opt: string | { pathname: string; query?: IKeyValue<string>; search?: string },
) {
  const pathNamePrefix = getRoutePreFix();
  if (pathNamePrefix) {
    if (typeof opt === 'string') {
      history.push(`${pathNamePrefix}${opt}`);
    } else {
      history.push({
        ...opt,
        pathname: `${pathNamePrefix}${opt.pathname}`,
      });
    }
  } else {
    history.push(opt);
  }
}

/**
 * 获取带前缀的pathanme
 * @param pathname 路径
 * @example  getFullPathName('/users/edit') ==> /xysis/users/edit
 */
export function getFullPathName(pathname: string) {
  const pathNamePrefix = getRoutePreFix();
  return `${pathNamePrefix}${pathname}`;
}

/**
 * 获取去掉前缀路由的路由
 * @param fullPathName 全路由
 */
export function getSimplePathName(fullPathName: string) {
  const pathNamePrefix = getRoutePreFix();
  return fullPathName.replace(new RegExp(`^${pathNamePrefix}`, 'gi'), '');
}
