import { history } from 'umi';
import { IKeyValue } from '@wetrial/core';
import { getRoutePreFix } from '@wetrial/core/es/route-helper';

/**
 *
 * @param opt
 */
export function historyPush(
  opt: string | { pathname: string; query?: IKeyValue<string>; search?: string },
) {
  const pathnamePrefix = getRoutePreFix();
  if (pathnamePrefix) {
    if (typeof opt === 'string') {
      history.push(`${pathnamePrefix}${opt}`);
    } else {
      history.push({
        ...opt,
        pathname: `${pathnamePrefix}${opt.pathname}`,
      });
    }
  } else {
    history.push(opt);
  }
}

/**
 * 获取带前缀的pathanme
 * @param pathname 路径
 */
export function getFullPathName(pathname: string) {
  const pathnamePrefix = getRoutePreFix();
  return `${pathnamePrefix}${pathname}`;
}
