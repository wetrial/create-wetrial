import { IBestAFSRoute } from '@umijs/plugin-layout';
import AccountRoutes from '../src/modules/account';
<% if (external.isApp) { %>//<% } %> import <%= external.upperCaseName %>Routes from '../src/modules/<%= external.lowerCaseName %>';

// umi routes: https://umijs.org/zh/guide/router.html
const routes: IBestAFSRoute[] = [
  {
    path: '/',
    menu: {
      name: '欢迎',
      flatMenu: true,
    },
    // component: '@/pages/body',
    routes: [
      {
        path: '/',
        redirect: '/template',
      },
      ...AccountRoutes,
      <% if (external.isApp) { %>//<% } %> ...<%= external.upperCaseName %>Routes,
    ],
  },
];

export default routes;
