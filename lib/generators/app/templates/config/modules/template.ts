import { IRoute } from 'umi-types';

/**
 * 权限定义
 */
const <%= external.upperCaseName %>Permissions = {
  template: {
    dashboard: {
      base: 'template.dashboard.base',
    },
    list: {
      base: 'template.list.base',
    },
  },
};

/**
 * 路由定义
 */
const <%= external.upperCaseName %>Routes: IRoute[] = [
  {
    path: '/<%= external.lowerCaseName %>',
    name: '看板',
    icon: 'dashboard',
    authority: <%= external.upperCaseName %>Permissions.template.dashboard.base,
    component: './<%= external.upperCaseName %>/Dashboard/index',
  },
  {
    path: '/<%= external.lowerCaseName %>-list',
    name: '列表',
    authority: <%= external.upperCaseName %>Permissions.template.list.base,
    icon: 'smile',
    routes: [
      { path: '/<%= external.lowerCaseName %>-table', redirect: '/<%= external.lowerCaseName %>-list/table' },
      {
        path: 'table',
        name: '普通表格',
        component: './<%= external.upperCaseName %>/TableList/index',
      },
    ],
  },
];

export default <%= external.upperCaseName %>Permissions;
export { <%= external.upperCaseName %>Routes };
