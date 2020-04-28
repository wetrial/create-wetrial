import { IBestAFSRoute } from '@umijs/plugin-layout';

const ROUTE_BASE = '@/modules/<%= external.lowerCaseName %>/';

/**
 * 权限定义
 */
const Permissions = {
  template: {
    dashboard: {
      index: '',
    },
    sample: {
      index: '',
      list: {
        index: '',
        edit: '',
        delete: '',
      },
    },
  },
};

/**
 * 路由定义
 */
const Routes: IBestAFSRoute[] = [
  {
    path: '/<%= external.lowerCaseName %>',
    menu: {
      name: '博客', // 兼容此写法
      // hideChildren:false,
      flatMenu: true,
    },
    routes: [
      {
        path: '/<%= external.lowerCaseName %>',
        redirect: 'dashboard',
      },
      {
        path: 'dashboard',
        name: '博客看板',
        icon: 'dashboard',
        access: Permissions.template.dashboard.index,
        component: `${ROUTE_BASE}dashboard/index`,
      },
      {
        path: 'sample',
        name: '博客例子',
        access: Permissions.template.sample.index,
        icon: 'smile',
        routes: [
          {
            path: '/<%= external.lowerCaseName %>/sample',
            redirect: 'list',
          },
          {
            path: 'list',
            name: '博客列表',
            access: Permissions.template.sample.list.index,
            component: `${ROUTE_BASE}sample/list/index`,
            exact: true,
          },
          {
            path: 'list/edit/:id?',
            component: `${ROUTE_BASE}sample/list/edit`,
            access: Permissions.template.sample.list.edit,
            exact: true,
          },
        ],
      },
    ],
  },
];

export default Routes;
export { Permissions };
