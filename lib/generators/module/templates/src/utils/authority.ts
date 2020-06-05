export { getToken, setToken, clearToken } from '@wetrial/core/es/authority';

// import storeWithExp from '@wetrial/core/es/store';

/**
 * 系统级别的存储key前缀
 */
const SYSTEM_STORAGE_PREFIX = '__';

/**
 * 设置oid
 * @param oid
 */
export const setOid = (oid) => {
  sessionStorage.setItem(`${SYSTEM_STORAGE_PREFIX}oid`, oid);
};

/**
 * 查询oid
 */
export const getOid = () => {
  return sessionStorage.getItem(`${SYSTEM_STORAGE_PREFIX}oid`);
};

/**
 * 设置pid
 * @param oid
 */
export const setPid = (pid) => {
  sessionStorage.setItem(`${SYSTEM_STORAGE_PREFIX}pid`, pid);
};

/**
 * 查询pid
 */
export const getPid = () => {
  return sessionStorage.getItem(`${SYSTEM_STORAGE_PREFIX}pid`);
};

/**
 * 清空pid以及oid
 */
export const clearPidAndOid = () => {
  sessionStorage.removeItem(`${SYSTEM_STORAGE_PREFIX}pid`);
  sessionStorage.removeItem(`${SYSTEM_STORAGE_PREFIX}oid`);
};
