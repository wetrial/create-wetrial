import { IBestAFSRoute } from '@umijs/plugin-layout';

// 过滤菜单项
export function filterRouteMenu(arr: IBestAFSRoute[], menu: string) {
  const result: IBestAFSRoute[] = [];
  arr.forEach((item) => {
    if (!item.group || item.group === menu) {
      const newItem = item;
      if (item.routes && item.routes.length > 0) {
        newItem.routes = filterRouteMenu(item.routes, menu);
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
