import { IBestAFSRoute } from '@umijs/plugin-layout';

// 过滤菜单项
export function filterRouteMenu(arr: IBestAFSRoute[], groups: string[] = []) {
  const result: IBestAFSRoute[] = [];
  arr.forEach((item) => {
    if (!item.group || groups.indexOf(item.group) !== -1) {
      const newItem = item;
      if (item.routes && item.routes.length > 0) {
        newItem.routes = filterRouteMenu(item.routes, groups);
        if (newItem.routes.length > 0) {
          result.push(newItem);
        }
      } else {
        result.push(newItem);
      }
    }
  });
  return result;
}

/**
 * 从路由中查找指定gourp的路由
 * @param arr 路由数组
 * @param group 指定的组名
 */
export function findRouteMenu(arr: IBestAFSRoute[], group: string): IBestAFSRoute | undefined {
  let result: IBestAFSRoute | undefined;
  arr.forEach((item) => {
    if (item.group && item.group === group) {
      result = item;
      return;
    }
    if (item.routes && item.routes.length > 0) {
      result = findRouteMenu(item.routes, group);
      if (result) {
        return;
      }
    }
  });
  return result;
}
