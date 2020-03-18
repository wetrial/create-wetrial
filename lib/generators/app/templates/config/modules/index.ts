import { IBestAFSRoute } from '@umijs/plugin-layout';
import { <%= external.upperCaseName %>Routes } from './<%= external.lowerCaseName %>';

// umi routes: https://umijs.org/zh/guide/router.html
const routes: IBestAFSRoute[] = [
  {
    path: '/',
    menu: {
      name: '欢迎',
      flatMenu: true,
    },
    component: '@/pages/body',
    routes: [
      {
        path: '/account',
        component: '@/layouts/UserLayout',
        layout: {
          hideNav: true,
          hideMenu: true,
        },
        routes: [
          {
            name: '登录',
            path: 'login',
            component: '@/pages/account/login/index',
          },
        ],
      },
      ...<%= external.upperCaseName %>Routes,
    ],
  },
];
export default routes;
