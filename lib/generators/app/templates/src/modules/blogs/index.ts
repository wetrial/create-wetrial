import { IBestAFSRoute } from '@umijs/plugin-layout';

const ROUTE_BASE = '@/modules/<%= external.lowerCaseName %>/pages/';

export const <%= external.upperCaseName %>Permissions = {
  <%= external.fullLowerCaseName %>: {

  },
};

export const <%= external.upperCaseName %>Routes: IBestAFSRoute[] = [
  {
    path: '/<%= external.lowerCaseName %>',
    menu: {
      name: '欢迎',
      flatMenu: true,
    },
    routes: [
      {
        path: '/<%= external.lowerCaseName %>',
        redirect:'dashboard'
      },
      {
        path: 'dashboard',
        name: '看板',
        // access: <%= external.upperCaseName %>Permissions.<%= external.lowerCaseName %>.,
        component: `${ROUTE_BASE}dashboard/index`,
        exact: true,
      },
    ],
  },
];
