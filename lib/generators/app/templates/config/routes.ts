import { IBestAFSRoute } from '@umijs/plugin-layout';
import { MembershipShareRoutes } from '../src/modules/membership-share';
<% if (!external.isApp) { %>// import { CodeListManagementRoutes } from '../src/modules/code-list-management';
<% if (theme==='platform-admin') { %>import { AuditLoggingPlatformAdminRoutes } from '../src/modules/audit-logging-platform-admin';<% } %>
import { <%= external.upperCaseName %>Routes } from '../src/modules/<%= external.lowerCaseName %>';
<% } %>

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
      ...MembershipShareRoutes,
      <% if (!external.isApp) { %>// ...CodeListManagementRoutes,
      <% if (theme==='platform-admin') { %>...AuditLoggingPlatformAdminRoutes,<% } %>
      ...<%= external.upperCaseName %>Routes,<% } %>
    ],
  },
];

export default routes;
