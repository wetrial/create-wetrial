import { IBestAFSRoute } from '@umijs/plugin-layout';
// import { MembershipShareRoutes } from '../src/modules/membership-share';
<% if (external.isApp) { %>//<% } %>import {<%= external.upperCaseName %>Routes} from '../src/modules/<%= external.lowerCaseName %>';

// umi routes: https://umijs.org/zh/guide/router.html
const routes: IBestAFSRoute[]= [
  {
    path: '/',
    menu: {
      name: '欢迎',
      flatMenu: true,
    },
    routes: [
      {
        path: '/',
        redirect: '/<%= external.trimThemeLowerCaseName %>',
      },
      // ...MembershipShareRoutes,
      <% if (external.isApp) { %>//<% } %> ...<%= external.upperCaseName %>Routes,
    ],
  },
];

export default routes;
