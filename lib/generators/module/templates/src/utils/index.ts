import { history } from 'umi';
import { IKeyValue } from '@wetrial/core';
import { getPid, getOid } from '@/utils/authority';

/**
 *
 * @param opt
 */
export function historyPush(opt: string | { pathname: string; query?: IKeyValue<string> }) {
  const oid = getOid();
  const pid = getPid();
  let pathnamePrefix = '';
  if (oid) {
    pathnamePrefix += `/${oid}`;
  }
  if (pid) {
    pathnamePrefix += `/${pid}`;
  }
  if (typeof opt === 'string') {
    history.push(`${pathnamePrefix}${opt}`);
  } else {
    history.push({
      ...opt,
      pathname: `${pathnamePrefix}${opt.pathname}`,
    });
  }
}

/**
 * 获取带前缀的pathanme
 * @param pathname 路径
 */
export function getFullPathName(pathname: string) {
  const oid = getOid();
  const pid = getPid();
  let pathnamePrefix = '';
  if (oid) {
    pathnamePrefix += `/${oid}`;
  }
  if (pid) {
    pathnamePrefix += `/${pid}`;
  }
  return `${pathnamePrefix}${pathname}`;
}
