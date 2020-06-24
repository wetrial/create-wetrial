import { IBestAFSRoute } from '@umijs/plugin-layout';
import { GROUP } from '@wetrial/core/lib/route-helper';

const ROUTE_BASE = '@/modules/<%= external.lowerCaseName %>/pages/';

export const <%= external.upperCaseName %>Permissions = {
  <%= external.fullLowerCaseName %>: {

  },
};

export const <%= external.upperCaseName %>Routes: IBestAFSRoute[] = [
  {
    path: '/<%= external.trimThemeLowerCaseName %>',
    menu: {
      name: '欢迎',
      flatMenu: true,
    },
    routes: [
      {
        path: '/<%= external.trimThemeLowerCaseName %>',
        redirect:'dashboard'
      },
      {
        path: 'dashboard',
        name: '看板',
        // group: GROUP.PLATFORM,
        // access: <%= external.upperCaseName %>Permissions.<%= external.lowerCaseName %>.,
        component: `${ROUTE_BASE}dashboard/index`,
        exact: true,
      },
    ],
  },
];
