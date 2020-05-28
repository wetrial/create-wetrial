import { IBestAFSRoute } from '@umijs/plugin-layout';
// import AccountRoutes from '../src/modules/account';
<% if (external.isApp) { %>//<% } %>import {<%= external.upperCaseName %>Routes} from '../src/modules/<%= external.lowerCaseName %>';
import {filterRouteMenu} from '../src/utils';
import packageModule from '../package-module.json';

// umi routes: https://umijs.org/zh/guide/router.html
const routes: IBestAFSRoute[]= filterRouteMenu([
  {
    path: '/',
    menu: {
      name: '欢迎',
      flatMenu: true,
    },
    routes: [
      {
        path: '/',
        redirect: '/<%= external.lowerCaseName %>',
      },
      // ...AccountRoutes,
      <% if (external.isApp) { %>//<% } %> ...<%= external.upperCaseName %>Routes,
    ],
  },
],packageModule['theme']||"organization");

export default routes;
